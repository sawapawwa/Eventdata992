export const defaultCenter = {
  label: 'Mt Vernon, Baltimore, MD',
  lat: 39.2974,
  lon: -76.6169
};

export const careerSegments = ['career', 'careers', 'job', 'jobs', 'employment', 'opportunities'];

export const careerPathCandidates = [
  '/careers',
  '/career',
  '/jobs',
  '/job',
  '/employment',
  '/opportunities'
];

export const businessTagPairs = [
  ['shop', '.*'],
  ['amenity', '.*'],
  ['office', '.*'],
  ['craft', '.*'],
  ['tourism', '.*'],
  ['leisure', '.*'],
  ['healthcare', '.*'],
  ['man_made', 'works'],
  ['industrial', '.*'],
  ['landuse', 'commercial|retail|industrial'],
  ['building', 'commercial|retail|industrial|office']
];

export const fallbackBusinesses = [
  { name: 'MedStar Health', website: 'https://www.medstarhealth.org/careers', lat: 39.3017, lon: -76.5931, kind: 'healthcare' },
  { name: 'Johns Hopkins Medicine', website: 'https://jobs.hopkinsmedicine.org', lat: 39.2965, lon: -76.592, kind: 'healthcare' },
  { name: 'T. Rowe Price', website: 'https://www.troweprice.com/corporate/us/en/careers.html', lat: 39.2881, lon: -76.6134, kind: 'office' },
  { name: 'Under Armour', website: 'https://careers.underarmour.com', lat: 39.2705, lon: -76.6013, kind: 'retail' },
  { name: 'Maryland Transit Administration', website: 'https://www.mta.maryland.gov/jobs', lat: 39.3078, lon: -76.6178, kind: 'transport' },
  { name: 'Sinai Hospital', website: 'https://www.lifebridgehealth.org/careers', lat: 39.3526, lon: -76.6627, kind: 'healthcare' },
  { name: 'Mercy Medical Center', website: 'https://mdmercy.com/careers', lat: 39.2929, lon: -76.6159, kind: 'healthcare' },
  { name: 'University of Maryland Medical Center', website: 'https://www.umms.org/careers', lat: 39.2889, lon: -76.624, kind: 'healthcare' }
];
