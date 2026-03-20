export interface Job {
  id: string;
  title: string;
  employer: string;
  verified: boolean;
  type: 'Casual' | 'Short-term' | 'Full-time' | 'Apprenticeship';
  matchScore: number;
  location: string;
  distance: string;
  duration: string;
  workers: number;
  payRate: string;
  aiNote: string;
  image: string;
  description: string;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Tea Harvesting Assistant',
    employer: 'Musanze Tea Cooperative',
    verified: true,
    type: 'Casual',
    matchScore: 94,
    location: 'Musanze, Rwanda',
    distance: '2.3 km',
    duration: '3 weeks',
    workers: 15,
    payRate: '5,000 RWF/day',
    aiNote: 'Great match! Your farming experience is perfect for this role.',
    image: 'https://images.unsplash.com/photo-1758390282832-6a401f0f5268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBwbGFudGF0aW9uJTIwaGFydmVzdGluZyUyMHdvcmtlcnN8ZW58MXx8fHwxNzcyODgxOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Join our team during harvest season. Help pick fresh tea leaves from our plantation. Training provided for new workers.',
  },
  {
    id: '2',
    title: 'Construction Helper',
    employer: 'Kigali Building Co.',
    verified: true,
    type: 'Short-term',
    matchScore: 87,
    location: 'Kigali, Rwanda',
    distance: '4.1 km',
    duration: '2 months',
    workers: 8,
    payRate: '40,000 RWF/week',
    aiNote: 'Your availability matches perfectly with this project timeline.',
    image: 'https://images.unsplash.com/photo-1722971334403-4f02388455a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYnVpbGRpbmclMjB3b3JrfGVufDF8fHx8MTc3MjgwNjM0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Assist with general construction tasks including carrying materials, site cleanup, and supporting skilled workers.',
  },
  {
    id: '3',
    title: 'Restaurant Kitchen Staff',
    employer: 'Rwanda Fresh Cafe',
    verified: false,
    type: 'Full-time',
    matchScore: 76,
    location: 'Musanze, Rwanda',
    distance: '1.8 km',
    duration: 'Ongoing',
    workers: 2,
    payRate: '150,000 RWF/month',
    aiNote: 'Based on your location and skills, this could be a good fit.',
    image: 'https://images.unsplash.com/photo-1512149519538-136d1b8c574a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGNoZWYlMjBjb29raW5nfGVufDF8fHx8MTc3Mjg4MTk4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Work in a busy restaurant kitchen. Help with food preparation, dishwashing, and maintaining kitchen cleanliness.',
  },
];
