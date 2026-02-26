export const defaultCenter = {
  label: 'Mt Vernon, Baltimore, MD',
  lat: 39.2974,
  lon: -76.6169
};

export const careerSegments = ['career', 'careers', 'job', 'jobs', 'employment', 'opportunities', 'team', 'join-us', 'join', 'hiring', 'openings', 'vacancies', 'recruitment', 'talent', 'work-with-us'];

export const careerPathCandidates = [
  '/careers',
  '/career',
  '/jobs',
  '/job',
  '/employment',
  '/opportunities',
  '/join-us',
  '/work-with-us',
  '/team',
  '/join',
  '/hiring',
  '/openings',
  '/vacancies',
  '/recruitment',
  '/talent'
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

export const jobRoleKeywords = [
  'software engineer', 'registered nurse', 'medical assistant', 'data analyst', 'customer service',
  'warehouse', 'delivery driver', 'teacher', 'accountant', 'project manager', 'security officer',
  'administrative assistant', 'electrician', 'plumber', 'sales associate', 'marketing', 'hr',
  'business analyst', 'cybersecurity', 'mechanic'
];


export const overpassEndpoints = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];


export const cityCenters = {
  'baltimore': { label: 'Baltimore, MD', lat: 39.2904, lon: -76.6122 },
  'baltimore, md': { label: 'Baltimore, MD', lat: 39.2904, lon: -76.6122 },
  'mt vernon': { label: 'Mt Vernon, Baltimore, MD', lat: 39.2974, lon: -76.6169 },
  'mt vernon baltimore': { label: 'Mt Vernon, Baltimore, MD', lat: 39.2974, lon: -76.6169 },
  'washington, dc': { label: 'Washington, DC', lat: 38.9072, lon: -77.0369 },
  'new york, ny': { label: 'New York, NY', lat: 40.7128, lon: -74.006 },
  'philadelphia, pa': { label: 'Philadelphia, PA', lat: 39.9526, lon: -75.1652 }
};


export const hiringKeywords = [
  'jobs','job','career','careers','hiring','join-us','join','join-our-team','team','our-team','work-with-us','work-for-us','apply','apply-now','openings','vacancies','positions','recruitment','talent','talent-acquisition','employment','opportunities','internships','apprenticeships','students','graduates','early-careers','experienced-hires','leadership','part-time','full-time','contract','freelance','remote','hybrid','on-site','staffing','human-resources','hr','people','culture','company/careers','about/careers','about-us/careers','careers-at','opportunities-at','become-a-driver','become-a-partner','work','work-here','join-team','join-the-team','hiring-now','now-hiring','available-positions','job-openings','career-opportunities','employment-opportunities','joinus','jobs-at','careers-at-company','applytoday','vacancy','vacancies-list','jobs-list','roles','current-openings','find-jobs','search-jobs','candidate','recruiting','join-our-company','future-talent','graduates-and-interns','interns','fellows','residency','residents','physician-jobs','nursing-jobs'
];
