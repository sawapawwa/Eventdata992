export const locations = [
  { id: 'seattle', name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
  { id: 'portland', name: 'Portland, OR', lat: 45.5152, lon: -122.6784 },
  { id: 'san-francisco', name: 'San Francisco, CA', lat: 37.7749, lon: -122.4194 },
  { id: 'denver', name: 'Denver, CO', lat: 39.7392, lon: -104.9903 }
];

export const businesses = [
  {
    id: 'northstar-coffee',
    name: 'Northstar Coffee Roasters',
    category: 'Food & Beverage',
    location: 'Seattle, WA',
    lat: 47.621,
    lon: -122.336,
    careersUrl: 'https://example.com/northstar/careers',
    jobs: [
      { title: 'Barista', type: 'Full-time' },
      { title: 'Shift Lead', type: 'Full-time' }
    ]
  },
  {
    id: 'cascade-digital',
    name: 'Cascade Digital Solutions',
    category: 'Technology',
    location: 'Seattle, WA',
    lat: 47.598,
    lon: -122.331,
    careersUrl: 'https://example.com/cascade/jobs',
    jobs: [
      { title: 'Front-End Developer', type: 'Full-time' },
      { title: 'Product Designer', type: 'Contract' }
    ]
  },
  {
    id: 'rose-city-health',
    name: 'Rose City Health Partners',
    category: 'Healthcare',
    location: 'Portland, OR',
    lat: 45.523,
    lon: -122.676,
    careersUrl: 'https://example.com/rosecity/careers',
    jobs: [
      { title: 'Medical Assistant', type: 'Full-time' },
      { title: 'Patient Coordinator', type: 'Part-time' }
    ]
  },
  {
    id: 'bayline-logistics',
    name: 'Bayline Logistics',
    category: 'Supply Chain',
    location: 'San Francisco, CA',
    lat: 37.784,
    lon: -122.407,
    careersUrl: 'https://example.com/bayline/jobs',
    jobs: [
      { title: 'Operations Analyst', type: 'Full-time' },
      { title: 'Dispatcher', type: 'Full-time' }
    ]
  },
  {
    id: 'milehigh-renewables',
    name: 'Mile High Renewables',
    category: 'Energy',
    location: 'Denver, CO',
    lat: 39.744,
    lon: -104.989,
    careersUrl: 'https://example.com/milehigh/careers',
    jobs: [
      { title: 'Field Technician', type: 'Full-time' },
      { title: 'Project Coordinator', type: 'Hybrid' }
    ]
  }
];
