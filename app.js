import { businesses, locations } from './data.js';

const locationSelect = document.querySelector('#location');
const distanceInput = document.querySelector('#distance');
const distanceLabel = document.querySelector('#distanceLabel');
const resultCount = document.querySelector('#resultCount');
const businessList = document.querySelector('#businessList');

const milesBetween = (lat1, lon1, lat2, lon2) => {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return earthRadiusMiles * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const populateLocations = () => {
  locations.forEach((location) => {
    const option = document.createElement('option');
    option.value = location.id;
    option.textContent = location.name;
    locationSelect.append(option);
  });
};

const renderBusinesses = () => {
  const selectedLocation = locations.find(({ id }) => id === locationSelect.value) || locations[0];
  const selectedDistance = Number(distanceInput.value);
  distanceLabel.textContent = `${selectedDistance} miles`;

  const results = businesses
    .map((business) => ({
      ...business,
      distance: milesBetween(selectedLocation.lat, selectedLocation.lon, business.lat, business.lon)
    }))
    .filter(({ distance }) => distance <= selectedDistance)
    .sort((a, b) => a.distance - b.distance);

  resultCount.textContent = `${results.length} business${results.length === 1 ? '' : 'es'} found within ${selectedDistance} miles of ${selectedLocation.name}.`;

  businessList.innerHTML = '';

  if (!results.length) {
    businessList.innerHTML = '<p class="empty-state">No businesses found in this range. Increase your distance to see more options.</p>';
    return;
  }

  results.forEach((business) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${business.name}</h3>
      <p>${business.category} • ${business.location}</p>
      <p><strong>${business.distance.toFixed(1)} miles away</strong></p>
      <a class="button" href="careers.html?business=${encodeURIComponent(business.id)}">View jobs & careers</a>
    `;
    businessList.append(card);
  });
};

populateLocations();
locationSelect.value = locations[0].id;
renderBusinesses();

locationSelect.addEventListener('change', renderBusinesses);
distanceInput.addEventListener('input', renderBusinesses);
