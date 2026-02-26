import {
  businessTagPairs,
  careerPathCandidates,
  careerSegments,
  defaultCenter,
  externalJobSearches,
  fallbackBusinesses
} from './data.js';

const cityInput = document.querySelector('#cityQuery');
const radiusMilesInput = document.querySelector('#radiusMiles');
const searchButton = document.querySelector('#searchButton');
const statusMessage = document.querySelector('#statusMessage');
const businessList = document.querySelector('#businessList');
const strictUrlToggle = document.querySelector('#strictUrlToggle');
const externalLinksList = document.querySelector('#externalLinksList');

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
  if (!urlValue) {
    return false;
  }

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
  if (!value) {
    return null;
  }

  const candidate = value.trim();
  if (!candidate) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
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

const geocodeCity = async (query) => {
  const trimmed = query.trim();

  if (!trimmed || trimmed.toLowerCase() === defaultCenter.label.toLowerCase()) {
    return defaultCenter;
  }

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error('Unable to find that city right now.');
  }

  const results = await response.json();
  if (!results.length) {
    throw new Error('City not found. Try city and state, like "Baltimore, MD".');
  }

  return {
    label: results[0].display_name || trimmed,
    lat: Number(results[0].lat),
    lon: Number(results[0].lon)
  };
};

const fetchBusinessesFromOverpass = async (center, radiusMiles) => {
  const radiusMeters = Math.round(radiusMiles * 1609.34);
  const categoryQuery = buildOverpassCategoryQuery(radiusMeters, center);
  const query = `
[out:json][timeout:60];
(
${categoryQuery}
);
out center tags;
`.trim();

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: query
  });

  if (!response.ok) {
    throw new Error('Unable to fetch nearby businesses right now. Try again in a minute.');
  }

  const data = await response.json();
  const deduped = new Map();

  (data.elements || []).forEach((element) => {
    const tags = element.tags || {};
    const name = (tags.name || '').trim();
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;

    if (!name || typeof lat !== 'number' || typeof lon !== 'number') {
      return;
    }

    const website = normalizeUrl(tags.website || tags['contact:website']);
    const kind = tags.shop || tags.amenity || tags.office || 'business';
    const sourceUrl = `https://www.openstreetmap.org/${element.type}/${element.id}`;

    const key = `${name.toLowerCase()}::${lat.toFixed(5)}::${lon.toFixed(5)}`;
    if (!deduped.has(key)) {
      deduped.set(key, {
        id: key,
        name,
        website,
        lat,
        lon,
        kind,
        source: 'OpenStreetMap',
        sourceUrl
      });
    }
  });

  return [...deduped.values()];
};

const inferredCareerLinks = (website) => {
  if (!website) {
    return [];
  }

  try {
    const parsed = new URL(website);
    const base = `${parsed.protocol}//${parsed.host}`;
    return careerPathCandidates.map((path) => `${base}${path}`);
  } catch {
    return [];
  }
};

const dedupeBusinesses = (items) => {
  const map = new Map();

  items.forEach((business) => {
    const key = business.website ? business.website.toLowerCase() : business.name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, business);
    }
  });

  return [...map.values()];
};

const renderExternalLinks = (cityLabel) => {
  const city = encodeURIComponent(cityLabel);
  const query = encodeURIComponent('hiring careers jobs');

  externalLinksList.innerHTML = externalJobSearches
    .map(({ name, urlTemplate }) => {
      const url = urlTemplate.replace('{city}', city).replace('{query}', query);
      return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`;
    })
    .join('');
};

const renderCards = (results, strictMode) => {
  const visible = strictMode ? results.filter((item) => hasCareerSubpage(item.website)) : results;

  if (!visible.length) {
    businessList.innerHTML =
      '<p class="empty-state">No businesses matched the current filter. Turn off strict URL mode to show all businesses found for this city.</p>';
    return;
  }

  businessList.innerHTML = '';

  visible.forEach((business) => {
    const detectedCareerUrl = hasCareerSubpage(business.website);
    const fallbackLinks = inferredCareerLinks(business.website);

    const linksHtml = detectedCareerUrl
      ? `<li><a href="${business.website}" target="_blank" rel="noopener noreferrer">${business.website}</a></li>`
      : fallbackLinks
          .map((url) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>`)
          .join('');

    const websiteLine = business.website
      ? `<p class="url-line">Website: <a href="${business.website}" target="_blank" rel="noopener noreferrer">${business.website}</a></p>`
      : '<p class="url-line">Website not listed in map data.</p>';

    const sourceLink = business.sourceUrl
      ? `<a href="${business.sourceUrl}" target="_blank" rel="noopener noreferrer">${business.source}</a>`
      : business.source || 'Fallback Curated List';

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${business.name}</h3>
      <p>${business.kind} • ${business.distance.toFixed(1)} miles away</p>
      ${websiteLine}
      <p><strong>${detectedCareerUrl ? 'Detected career/jobs URL' : 'Possible career/jobs links'}</strong></p>
      <ul class="url-list">${linksHtml || '<li>No website available to generate links.</li>'}</ul>
      <p class="source-line">Source: ${sourceLink}</p>
    `;
    businessList.append(card);
  });
};

const withComputedDistance = (items, center) =>
  items
    .map((business) => ({
      ...business,
      id: business.id || `${business.name.toLowerCase()}::${business.lat.toFixed(5)}::${business.lon.toFixed(5)}`,
      distance: milesBetween(center.lat, center.lon, business.lat, business.lon)
    }))
    .sort((a, b) => a.distance - b.distance);

const renderResults = async () => {
  const radiusMiles = Number(radiusMilesInput.value) || 15;
  const cityQuery = cityInput.value;
  const strictMode = strictUrlToggle.checked;

  statusMessage.textContent = 'Searching businesses across many categories in this city area…';
  businessList.innerHTML = '';

  try {
    const center = await geocodeCity(cityQuery);
    let discovered = [];

    try {
      discovered = await fetchBusinessesFromOverpass(center, radiusMiles);
    } catch {
      discovered = [];
    }

    const fallbackNearby = fallbackBusinesses
      .filter((business) => milesBetween(center.lat, center.lon, business.lat, business.lon) <= radiusMiles)
      .map((business) => ({ ...business, sourceUrl: business.website }));

    const combined = dedupeBusinesses([...discovered, ...fallbackNearby]);
    const withDistance = withComputedDistance(combined, center);

    const withWebsite = withDistance.filter((business) => Boolean(business.website)).length;
    const withCareerKeyword = withDistance.filter((business) => hasCareerSubpage(business.website)).length;

    statusMessage.textContent = `Found ${withDistance.length} businesses around ${center.label} (${radiusMiles} miles). ${withWebsite} include websites and ${withCareerKeyword} already include career/job keywords.`;

    renderExternalLinks(center.label);
    renderCards(withDistance, strictMode);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while searching.';
    statusMessage.textContent = message;
    businessList.innerHTML = '<p class="empty-state">Try a different city text (example: Baltimore, MD).</p>';
    externalLinksList.innerHTML = '';
  }
};

searchButton.addEventListener('click', renderResults);
radiusMilesInput.addEventListener('change', renderResults);
strictUrlToggle.addEventListener('change', renderResults);

renderResults();
