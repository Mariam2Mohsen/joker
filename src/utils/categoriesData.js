const ZERO_STATE_SVG = `data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23FEFAF6'/%3E%3Cpath d='M0 0l800 600M800 0L0 600' stroke='%23EADBC8' stroke-width='2' opacity='0.3'/%3E%3Crect x='300' y='200' width='200' height='200' rx='40' fill='%23102C57' opacity='0.05'/%3E%3Ctext x='400' y='310' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='%23102C57' opacity='0.2' text-anchor='middle' text-transform='uppercase' letter-spacing='4'%3ENO IMAGE%3C/text%3E%3C/svg%3E`;

export const CATEGORIES_DATA = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    slug: 'cleaning',
    icon: 'https://cdn-icons-png.flaticon.com/512/995/995053.png',
    image: ZERO_STATE_SVG,
    rate: '$25/hr',
    color: '#00B4D8',
    description: 'Expert residential and commercial cleaning services.',
    subCategories: [
      { id: 'house-cleaning', name: 'House Cleaning', rating: 4.8 },
      { id: 'office-cleaning', name: 'Office Cleaning', rating: 4.7 },
      { id: 'deep-clean', name: 'Deep Cleaning', rating: 4.9 },
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    icon: 'https://cdn-icons-png.flaticon.com/512/3076/3076413.png',
    image: ZERO_STATE_SVG,
    rate: '$40/hr',
    color: '#EF4444',
    description: 'Professional plumbing repairs and installations.',
    subCategories: [
      { id: 'leaks', name: 'Leak Repair', rating: 4.9 },
      { id: 'installation', name: 'Fixture Installation', rating: 4.6 },
      { id: 'drains', name: 'Drain Cleaning', rating: 4.5 },
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    slug: 'electrical',
    icon: 'https://cdn-icons-png.flaticon.com/512/1904/1904991.png',
    image: ZERO_STATE_SVG,
    rate: '$45/hr',
    color: '#F59E0B',
    description: 'Certified electrical work for home and business.',
    subCategories: [
      { id: 'wiring', name: 'Home Wiring', rating: 4.7 },
      { id: 'lighting', name: 'Lighting Setup', rating: 4.8 },
      { id: 'repairs', name: 'Electrical Repairs', rating: 4.9 },
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    slug: 'painting',
    icon: 'https://cdn-icons-png.flaticon.com/512/1034/1034153.png',
    image: ZERO_STATE_SVG,
    rate: '$30/hr',
    color: '#8B5CF6',
    description: 'Interior and exterior painting services.',
    subCategories: [
      { id: 'interior', name: 'Interior Paint', rating: 4.8 },
      { id: 'exterior', name: 'Exterior Paint', rating: 4.7 },
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    slug: 'carpentry',
    icon: 'https://cdn-icons-png.flaticon.com/512/2635/2635391.png',
    image: ZERO_STATE_SVG,
    rate: '$35/hr',
    color: '#D97706',
    description: 'Custom woodworking and furniture repairs.',
    subCategories: [
      { id: 'furniture', name: 'Furniture Assembly', rating: 4.6 },
      { id: 'custom', name: 'Custom Cabinets', rating: 4.9 },
    ]
  },
  {
    id: 'gardening',
    name: 'Gardening',
    slug: 'gardening',
    icon: 'https://cdn-icons-png.flaticon.com/512/1518/1518915.png',
    image: ZERO_STATE_SVG,
    rate: '$20/hr',
    color: '#10B981',
    description: 'Landscaping and garden maintenance.',
    subCategories: [
      { id: 'lawn', name: 'Lawn Mowing', rating: 4.5 },
      { id: 'landscaping', name: 'Landscaping', rating: 4.8 },
    ]
  }
];
