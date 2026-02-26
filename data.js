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
  '/opportunities',
  '/join-us',
  '/work-with-us'
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
  { name: 'MedStar Health', website: 'https://www.medstarhealth.org/careers', lat: 39.3017, lon: -76.5931, kind: 'healthcare', source: 'Fallback Curated List' },
  { name: 'Johns Hopkins Medicine', website: 'https://jobs.hopkinsmedicine.org', lat: 39.2965, lon: -76.592, kind: 'healthcare', source: 'Fallback Curated List' },
  { name: 'T. Rowe Price', website: 'https://www.troweprice.com/corporate/us/en/careers.html', lat: 39.2881, lon: -76.6134, kind: 'office', source: 'Fallback Curated List' },
  { name: 'Under Armour', website: 'https://careers.underarmour.com', lat: 39.2705, lon: -76.6013, kind: 'retail', source: 'Fallback Curated List' },
  { name: 'Maryland Transit Administration', website: 'https://www.mta.maryland.gov/jobs', lat: 39.3078, lon: -76.6178, kind: 'transport', source: 'Fallback Curated List' },
  { name: 'Sinai Hospital', website: 'https://www.lifebridgehealth.org/careers', lat: 39.3526, lon: -76.6627, kind: 'healthcare', source: 'Fallback Curated List' },
  { name: 'Mercy Medical Center', website: 'https://mdmercy.com/careers', lat: 39.2929, lon: -76.6159, kind: 'healthcare', source: 'Fallback Curated List' },
  { name: 'University of Maryland Medical Center', website: 'https://www.umms.org/careers', lat: 39.2889, lon: -76.624, kind: 'healthcare', source: 'Fallback Curated List' },
  { name: 'Morgan State University', website: 'https://morgan.peopleadmin.com', lat: 39.3444, lon: -76.5836, kind: 'education', source: 'Fallback Curated List' },
  { name: 'Towson University', website: 'https://www.towson.edu/about/administration/humanresources/jobs/', lat: 39.3934, lon: -76.6122, kind: 'education', source: 'Fallback Curated List' },
  { name: 'University of Baltimore', website: 'https://www.ubalt.edu/hr/jobs/', lat: 39.3055, lon: -76.6141, kind: 'education', source: 'Fallback Curated List' },
  { name: 'Baltimore City Public Schools', website: 'https://www.baltimorecityschools.org/careers', lat: 39.2904, lon: -76.6122, kind: 'education', source: 'Fallback Curated List' },
  { name: 'Northrop Grumman', website: 'https://www.northropgrumman.com/careers', lat: 39.2808, lon: -76.7403, kind: 'aerospace', source: 'Fallback Curated List' },
  { name: 'Lockheed Martin', website: 'https://www.lockheedmartin.com/en-us/careers.html', lat: 39.2507, lon: -76.7069, kind: 'aerospace', source: 'Fallback Curated List' },
  { name: 'McCormick & Company', website: 'https://careers.mccormick.com', lat: 39.4192, lon: -76.6069, kind: 'manufacturing', source: 'Fallback Curated List' },
  { name: 'CareFirst BlueCross BlueShield', website: 'https://careers.carefirst.com', lat: 39.2867, lon: -76.6175, kind: 'insurance', source: 'Fallback Curated List' },
  { name: 'Transamerica', website: 'https://careers.transamerica.com', lat: 39.2869, lon: -76.6139, kind: 'insurance', source: 'Fallback Curated List' },
  { name: 'CFG Bank Arena / Oak View Group', website: 'https://careers.oakviewgroup.com', lat: 39.2872, lon: -76.6247, kind: 'hospitality', source: 'Fallback Curated List' },
  { name: 'Maryland Department of Health', website: 'https://jobapscloud.com/MD/', lat: 39.2905, lon: -76.6104, kind: 'government', source: 'Fallback Curated List' },
  { name: 'Baltimore County Government', website: 'https://www.governmentjobs.com/careers/baltimorecountymd', lat: 39.4228, lon: -76.6168, kind: 'government', source: 'Fallback Curated List' },
  { name: 'City of Baltimore', website: 'https://www.governmentjobs.com/careers/baltimorecity', lat: 39.2904, lon: -76.6122, kind: 'government', source: 'Fallback Curated List' },
  { name: 'BGE', website: 'https://jobs.constellationenergy.com', lat: 39.2902, lon: -76.6127, kind: 'utility', source: 'Fallback Curated List' },
  { name: 'Constellation Energy', website: 'https://jobs.constellationenergy.com', lat: 39.2902, lon: -76.6127, kind: 'utility', source: 'Fallback Curated List' },
  { name: 'PNC', website: 'https://careers.pnc.com', lat: 39.2901, lon: -76.6151, kind: 'banking', source: 'Fallback Curated List' },
  { name: 'M&T Bank', website: 'https://jobs.mtb.com', lat: 39.2872, lon: -76.6145, kind: 'banking', source: 'Fallback Curated List' }
];

export const externalJobSearches = [
  { name: 'Indeed', urlTemplate: 'https://www.indeed.com/jobs?q={query}&l={city}' },
  { name: 'LinkedIn Jobs', urlTemplate: 'https://www.linkedin.com/jobs/search/?keywords={query}&location={city}' },
  { name: 'Google Jobs (search)', urlTemplate: 'https://www.google.com/search?q={query}+jobs+in+{city}' },
  { name: 'ZipRecruiter', urlTemplate: 'https://www.ziprecruiter.com/Jobs/{city}' },
  { name: 'Glassdoor', urlTemplate: 'https://www.glassdoor.com/Job/{city}-jobs-SRCH_IL.0,0_IM63.htm' }
];
