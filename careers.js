import { businesses } from './data.js';

const params = new URLSearchParams(window.location.search);
const businessId = params.get('business');

const businessName = document.querySelector('#businessName');
const businessLocation = document.querySelector('#businessLocation');
const jobsList = document.querySelector('#jobsList');

const selectedBusiness = businesses.find(({ id }) => id === businessId);

if (!selectedBusiness) {
  businessName.textContent = 'Business not found';
  businessLocation.textContent = 'Please go back and choose a valid business.';
  jobsList.innerHTML = '';
} else {
  businessName.textContent = `${selectedBusiness.name} Careers`;
  businessLocation.textContent = selectedBusiness.location;

  jobsList.innerHTML = selectedBusiness.jobs
    .map(
      (job) => `
        <article class="card">
          <h3>${job.title}</h3>
          <p>${job.type}</p>
          <a class="button" href="${selectedBusiness.careersUrl}" target="_blank" rel="noopener noreferrer">Apply on careers page</a>
        </article>
      `
    )
    .join('');
}
