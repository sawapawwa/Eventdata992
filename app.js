import { businesses, defaultCenter } from './data.js';

const locationQueryInput = document.querySelector('#locationQuery');
const radiusMilesInput = document.querySelector('#radiusMiles');
const searchButton = document.querySelector('#searchButton');
const statusMessage = document.querySelector('#statusMessage');
const businessList = document.querySelector('#businessList');

const CAREER_SEGMENTS = ['career', 'careers', 'job', 'jobs', 'employment', 'opportunities'];

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

    return CAREER_SEGMENTS.some(
      (segment) => path.includes(`/${segment}`) || path.includes(`${segment}/`) || hostname.startsWith(`${segment}.`)
    );
  } catch {
    return false;
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
    label: trimmed,
    lat: Number(results[0].lat),
    lon: Number(results[0].lon)
  };
};

const renderResults = async () => {
  const radiusMiles = Number(radiusMilesInput.value) || 15;
  const locationQuery = locationQueryInput.value;

  statusMessage.textContent = 'Searching…';
  businessList.innerHTML = '';

  try {
    const center = await geocodeLocation(locationQuery);

    const filtered = businesses
      .filter((business) => hasCareerSubpage(business.website))
      .map((business) => ({
        ...business,
        distance: milesBetween(center.lat, center.lon, business.lat, business.lon)
      }))
      .filter((business) => business.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);

    statusMessage.textContent = `${filtered.length} matching business URL${filtered.length === 1 ? '' : 's'} found within ${radiusMiles} miles of ${center.label}.`;

    if (!filtered.length) {
      businessList.innerHTML = '<p class="empty-state">No matching career/job URLs found in that radius.</p>';
      return;
    }

    filtered.forEach((business) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${business.name}</h3>
        <p>${business.location}</p>
        <p><strong>${business.distance.toFixed(1)} miles away</strong></p>
        <p class="url-line">${business.website}</p>
        <a class="button" href="${business.website}" target="_blank" rel="noopener noreferrer">Open career/jobs URL</a>
      `;
      businessList.append(card);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while searching.';
    statusMessage.textContent = message;
    businessList.innerHTML = '<p class="empty-state">Please update the location and try again.</p>';
  }
};

searchButton.addEventListener('click', renderResults);
radiusMilesInput.addEventListener('change', renderResults);

renderResults();
