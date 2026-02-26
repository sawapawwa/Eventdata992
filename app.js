import {
  businessTagPairs,
  careerPathCandidates,
  careerSegments,
  defaultCenter,
  externalJobSearches,
  fallbackBusinesses,
  jobRoleKeywords,
  overpassEndpoints,
  cityCenters,
  hiringKeywords
} from './data.js';

const cityInput = document.querySelector('#cityQuery');
const radiusMilesInput = document.querySelector('#radiusMiles');
const searchButton = document.querySelector('#searchButton');
const statusMessage = document.querySelector('#statusMessage');
const businessList = document.querySelector('#businessList');
const strictUrlToggle = document.querySelector('#strictUrlToggle');
const externalLinksList = document.querySelector('#externalLinksList');
const highVolumeLinksList = document.querySelector('#highVolumeLinksList');
const highVolumeCount = document.querySelector('#highVolumeCount');

let activeSearchId = 0;

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const milesBetween = (lat1, lon1, lat2, lon2) => {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusMiles * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const hasCareerSubpage = (urlValue) => {
  if (!urlValue) return false;
  try {
    const parsed = new URL(urlValue);
    const path = parsed.pathname.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();
    return careerSegments.some(
      (segment) => path.includes(`/${segment}`) || path.includes(`${segment}/`) || hostname.startsWith(`${segment}.`)
    );
  } catch {
    return false;
  }
};

const normalizeUrl = (value) => {
  if (!value) return null;
  const candidate = value.trim();
  if (!candidate) return null;
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 9000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const buildOverpassCategoryQuery = (radiusMeters, center) => {
  const lines = [];
  businessTagPairs.forEach(([tag, pattern]) => {
    ['node', 'way', 'relation'].forEach((entity) => {
      lines.push(`  ${entity}(around:${radiusMeters},${center.lat},${center.lon})[name][${tag}~"${pattern}"];`);
    });
  });
  return lines.join('\n');
};

const resolveCityLocally = (query) => {
  const key = query.trim().toLowerCase();
  if (!key) return defaultCenter;
  return cityCenters[key] || null;
};

const geocodeCity = async (query) => {
  const trimmed = query.trim();
  const local = resolveCityLocally(trimmed);
  if (local) return local;

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(trimmed)}`;
  const response = await fetchWithTimeout(endpoint, { headers: { Accept: 'application/json' } }, 6000);
  if (!response.ok) throw new Error('Unable to geocode city with remote API.');
  const results = await response.json();
  if (!results.length) throw new Error('City not found remotely.');
  return { label: results[0].display_name || trimmed, lat: Number(results[0].lat), lon: Number(results[0].lon) };
};

const fetchBusinessesFromOverpass = async (center, radiusMiles) => {
  const radiusMeters = Math.round(radiusMiles * 1609.34);
  const query = `\n[out:json][timeout:20];\n(\n${buildOverpassCategoryQuery(radiusMeters, center)}\n);\nout center tags 250;\n`.trim();

  for (const endpoint of overpassEndpoints) {
    try {
      const response = await fetchWithTimeout(
        endpoint,
        { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: query },
        8000
      );
      if (!response.ok) continue;
      const data = await response.json();
      const deduped = new Map();
      (data.elements || []).forEach((element) => {
        const tags = element.tags || {};
        const name = (tags.name || '').trim();
        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;
        if (!name || typeof lat !== 'number' || typeof lon !== 'number') return;
        const website = normalizeUrl(tags.website || tags['contact:website']);
        const kind = tags.shop || tags.amenity || tags.office || tags.craft || 'business';
        const sourceUrl = `https://www.openstreetmap.org/${element.type}/${element.id}`;
        const key = `${name.toLowerCase()}::${lat.toFixed(5)}::${lon.toFixed(5)}`;
        if (!deduped.has(key)) deduped.set(key, { id: key, name, website, lat, lon, kind, source: 'OpenStreetMap', sourceUrl });
      });
      return [...deduped.values()];
    } catch {
      // try next endpoint
    }
  }
  return [];
};

const inferredCareerLinks = (website) => {
  if (!website) return [];
  try {
    const parsed = new URL(website);
    const base = `${parsed.protocol}//${parsed.host}`;
    const candidates = new Set(careerPathCandidates.map((path) => `${base}${path}`));

    hiringKeywords.forEach((keyword) => {
      const clean = keyword.toLowerCase().replace(/[^a-z0-9-/]/g, '-').replace(/--+/g, '-');
      candidates.add(`${base}/${clean}`);
    });

    return [...candidates].slice(0, 80);
  } catch {
    return [];
  }
};

const dedupeBusinesses = (items) => {
  const map = new Map();
  items.forEach((business) => {
    const key = business.website ? business.website.toLowerCase() : business.name.toLowerCase();
    if (!map.has(key)) map.set(key, business);
  });
  return [...map.values()];
};

const buildBoardUrl = (template, cityLabel, queryTerm) =>
  template.replace('{city}', encodeURIComponent(cityLabel)).replace('{query}', encodeURIComponent(queryTerm));

const renderExternalLinks = (cityLabel) => {
  externalLinksList.innerHTML = externalJobSearches
    .map(({ name, urlTemplate }) => `<li><a href="${buildBoardUrl(urlTemplate, cityLabel, 'hiring careers jobs')}" target="_blank" rel="noopener noreferrer">${name}</a></li>`)
    .join('');
};

const renderHighVolumeLinks = (cityLabel, businesses) => {
  const links = [];
  externalJobSearches.forEach(({ name, urlTemplate }) => {
    jobRoleKeywords.forEach((role) => links.push({ label: `${name} — ${role}`, url: buildBoardUrl(urlTemplate, cityLabel, role) }));
  });
  businesses.slice(0, 100).forEach((business) => {
    externalJobSearches.forEach(({ name, urlTemplate }) =>
      links.push({ label: `${name} — ${business.name}`, url: buildBoardUrl(urlTemplate, cityLabel, `${business.name} jobs careers team join us`) })
    );
  });
  highVolumeCount.textContent = `${links.length} search links generated.`;
  highVolumeLinksList.innerHTML = links
    .slice(0, 260)
    .map(({ label, url }) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`)
    .join('');
};

const renderCards = (results, strictMode) => {
  const visible = strictMode ? results.filter((item) => hasCareerSubpage(item.website)) : results;
  if (!visible.length) {
    businessList.innerHTML = '<p class="empty-state">No employers matched this filter. Turn off strict URL mode to see all employers.</p>';
    return;
  }
  businessList.innerHTML = '';
  visible.forEach((business) => {
    const detectedCareerUrl = hasCareerSubpage(business.website);
    const linksHtml = detectedCareerUrl
      ? `<li><a href="${business.website}" target="_blank" rel="noopener noreferrer">${business.website}</a></li>`
      : inferredCareerLinks(business.website).slice(0, 20).map((url) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>`).join('');

    const localSearchLinks = externalJobSearches
      .map(({ name, urlTemplate }) => {
        const query = `${business.name} jobs careers team join us hiring`;
        const url = buildBoardUrl(urlTemplate, cityInput.value || defaultCenter.label, query);
        return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name} search for ${business.name}</a></li>`;
      })
      .join('');

    const sourceLink = business.sourceUrl
      ? `<a href="${business.sourceUrl}" target="_blank" rel="noopener noreferrer">${business.source}</a>`
      : business.source || 'Fallback Curated List';

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${business.name}</h3>
      <p>${business.kind} • ${business.distance.toFixed(1)} miles away</p>
      <p class="url-line">${business.website ? `Website: <a href="${business.website}" target="_blank" rel="noopener noreferrer">${business.website}</a>` : 'Website not listed in map data.'}</p>
      <p><strong>${detectedCareerUrl ? 'Detected career/jobs URL' : 'Possible career/jobs links'}</strong></p>
      <ul class="url-list">${linksHtml || '<li>No website available to generate links.</li>'}</ul>
      <p><strong>More ways to find this employer hiring:</strong></p>
      <ul class="url-list">${localSearchLinks}</ul>
      <p class="source-line">Source: ${sourceLink}</p>
    `;
    businessList.append(card);
  });
};

const withComputedDistance = (items, center) =>
  items
    .map((business) => ({ ...business, id: business.id || `${business.name.toLowerCase()}::${business.lat.toFixed(5)}::${business.lon.toFixed(5)}`, distance: milesBetween(center.lat, center.lon, business.lat, business.lon) }))
    .sort((a, b) => a.distance - b.distance);

const renderStatus = (items, center, radiusMiles, note = '') => {
  const withWebsite = items.filter((business) => Boolean(business.website)).length;
  const withCareerKeyword = items.filter((business) => hasCareerSubpage(business.website)).length;
  statusMessage.textContent = `Found ${items.length} employers around ${center.label} (${radiusMiles} miles). ${withWebsite} include websites and ${withCareerKeyword} already include hiring keywords.${note}`;
};

const renderResults = async () => {
  const currentSearchId = ++activeSearchId;
  const radiusMiles = Number(radiusMilesInput.value) || 15;
  const strictMode = strictUrlToggle.checked;

  statusMessage.textContent = 'Loading fast local matches, then trying live map endpoints…';
  businessList.innerHTML = '';

  const cityQuery = cityInput.value || defaultCenter.label;
  let center;

  try {
    center = await geocodeCity(cityQuery);
  } catch {
    center = resolveCityLocally(cityQuery) || defaultCenter;
  }

  const fallbackNearby = fallbackBusinesses
    .filter((business) => milesBetween(center.lat, center.lon, business.lat, business.lon) <= radiusMiles)
    .map((business) => ({ ...business, sourceUrl: business.website }));

  let combined = withComputedDistance(dedupeBusinesses(fallbackNearby), center);
  renderExternalLinks(center.label);
  renderHighVolumeLinks(center.label, combined);
  renderStatus(combined, center, radiusMiles, ' Showing curated matches immediately.');
  renderCards(combined, strictMode);

  const discovered = await fetchBusinessesFromOverpass(center, radiusMiles);
  if (currentSearchId !== activeSearchId) return;

  if (discovered.length) {
    combined = withComputedDistance(dedupeBusinesses([...discovered, ...fallbackNearby]), center);
    renderStatus(combined, center, radiusMiles, ' Live local map employers merged in.');
    renderHighVolumeLinks(center.label, combined);
    renderCards(combined, strictMode);
  } else {
    renderStatus(combined, center, radiusMiles, ' Live map endpoints unavailable right now, showing local curated + SEO keyword path guesses + search links.');
  }
};

searchButton.addEventListener('click', renderResults);
radiusMilesInput.addEventListener('change', renderResults);
strictUrlToggle.addEventListener('change', renderResults);
renderResults();
