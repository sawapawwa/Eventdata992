import { careerPathCandidates, careerSegments, defaultCenter } from './data.js';

const locationQueryInput = document.querySelector('#locationQuery');
const radiusMilesInput = document.querySelector('#radiusMiles');
const searchButton = document.querySelector('#searchButton');
const statusMessage = document.querySelector('#statusMessage');
const businessList = document.querySelector('#businessList');
const strictUrlToggle = document.querySelector('#strictUrlToggle');

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

const geocodeLocation = async (query) => {
  const trimmed = query.trim();

  if (!trimmed || trimmed.toLowerCase() === defaultCenter.label.toLowerCase()) {
    return defaultCenter;
  }

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Unable to geocode the location right now.');
  }

  const results = await response.json();
  if (!results.length) {
    throw new Error('No matching location found. Try a more specific address.');
  }

  return {
    label: results[0].display_name || trimmed,
    lat: Number(results[0].lat),
    lon: Number(results[0].lon)
  };
};

const fetchBusinessesFromOverpass = async (center, radiusMiles) => {
  const radiusMeters = Math.round(radiusMiles * 1609.34);
  const query = `
[out:json][timeout:25];
(
  node(around:${radiusMeters},${center.lat},${center.lon})[name][website];
  way(around:${radiusMeters},${center.lat},${center.lon})[name][website];
  relation(around:${radiusMeters},${center.lat},${center.lon})[name][website];
);
out center tags;
`.trim();

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    body: query
  });

  if (!response.ok) {
    throw new Error('Unable to fetch nearby businesses from OpenStreetMap right now.');
  }

  const data = await response.json();
  const deduped = new Map();

  (data.elements || []).forEach((element) => {
    const tags = element.tags || {};
    const website = normalizeUrl(tags.website || tags['contact:website']);
    const name = (tags.name || '').trim();
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;

    if (!website || !name || typeof lat !== 'number' || typeof lon !== 'number') {
      return;
    }

    const key = `${name.toLowerCase()}::${website.toLowerCase()}`;
    if (!deduped.has(key)) {
      deduped.set(key, {
        id: key,
        name,
        website,
        lat,
        lon,
        kind: tags.shop || tags.amenity || tags.office || tags.tourism || 'business'
      });
    }
  });

  return [...deduped.values()];
};

const inferredCareerLinks = (website) => {
  try {
    const parsed = new URL(website);
    const base = `${parsed.protocol}//${parsed.host}`;
    return careerPathCandidates.map((path) => `${base}${path}`);
  } catch {
    return [];
  }
};

const renderCards = (results, strictMode) => {
  if (!results.length) {
    businessList.innerHTML = '<p class="empty-state">No business websites were found in this radius. Try increasing miles or changing the location text.</p>';
    return;
  }

  businessList.innerHTML = '';

  results.forEach((business) => {
    const careerUrlFound = hasCareerSubpage(business.website);
    const linkList = careerUrlFound ? [business.website] : inferredCareerLinks(business.website);

    if (strictMode && !careerUrlFound) {
      return;
    }

    const linksHtml = linkList
      .map(
        (url) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>`
      )
      .join('');

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${business.name}</h3>
      <p>${business.kind} • ${business.distance.toFixed(1)} miles away</p>
      <p class="url-line">Main website: <a href="${business.website}" target="_blank" rel="noopener noreferrer">${business.website}</a></p>
      <p><strong>${careerUrlFound ? 'Detected career/jobs URL(s)' : 'Possible careers/jobs URLs to check'}</strong></p>
      <ul class="url-list">${linksHtml}</ul>
    `;

    businessList.append(card);
  });

  if (!businessList.children.length) {
    businessList.innerHTML = '<p class="empty-state">No websites had career/job path keywords. Turn off strict mode to see businesses plus suggested career links.</p>';
  }
};

const renderResults = async () => {
  const radiusMiles = Number(radiusMilesInput.value) || 15;
  const locationQuery = locationQueryInput.value;
  const strictMode = strictUrlToggle.checked;

  statusMessage.textContent = 'Searching nearby businesses from OpenStreetMap…';
  businessList.innerHTML = '';

  try {
    const center = await geocodeLocation(locationQuery);
    const discovered = await fetchBusinessesFromOverpass(center, radiusMiles);

    const withDistance = discovered
      .map((business) => ({
        ...business,
        distance: milesBetween(center.lat, center.lon, business.lat, business.lon)
      }))
      .sort((a, b) => a.distance - b.distance);

    const strictMatches = withDistance.filter((business) => hasCareerSubpage(business.website)).length;

    statusMessage.textContent = `Found ${withDistance.length} business website${withDistance.length === 1 ? '' : 's'} within ${radiusMiles} miles of ${center.label}. ${strictMatches} already include career/job keywords in URL.`;

    renderCards(withDistance, strictMode);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while searching.';
    statusMessage.textContent = message;
    businessList.innerHTML = '<p class="empty-state">Please update the location and try again.</p>';
  }
};

searchButton.addEventListener('click', renderResults);
radiusMilesInput.addEventListener('change', renderResults);
strictUrlToggle.addEventListener('change', renderResults);

renderResults();
