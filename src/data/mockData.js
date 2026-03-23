// Mock player data
export const players = [
  {
    id: 1,
    name: 'Marco Rossi',
    rating: 8.9,
    rank: 1,
    wins: 24,
    losses: 2,
    matches: 26,
    winRate: 92,
    avatar: 'https://i.pravatar.cc/150?img=12',
    badge: 'ELITE',
    trend: [8, 5, 7, 2, 0],
    bio: 'Dominating the backcourt with surgical precision.',
    bestPartner: 'Luca B.',
  },
  {
    id: 2,
    name: 'Elena Bianchi',
    rating: 8.2,
    rank: 2,
    wins: 19,
    losses: 4,
    matches: 23,
    winRate: 83,
    avatar: 'https://i.pravatar.cc/150?img=5',
    badge: 'PRO',
    trend: [6, 7, 4, 5, 2],
    bio: 'Quick reflexes and unstoppable at the net.',
    bestPartner: 'Marco R.',
  },
  {
    id: 3,
    name: 'Tu',
    rating: 7.4,
    rank: 3,
    wins: 11,
    losses: 7,
    matches: 18,
    winRate: 61,
    avatar: 'https://i.pravatar.cc/150?img=33',
    badge: 'ADVANCED',
    trend: [9, 8, 5, 4, 1],
    bio: 'Rising fast through the ranks.',
    bestPartner: 'Elena B.',
    isCurrentUser: true,
  },
  {
    id: 4,
    name: 'Luca Martini',
    rating: 7.1,
    rank: 4,
    wins: 15,
    losses: 8,
    matches: 23,
    winRate: 65,
    avatar: 'https://i.pravatar.cc/150?img=15',
    badge: 'ADVANCED',
    trend: [4, 6, 7, 8, 6],
    bio: 'Consistent player with a powerful serve.',
    bestPartner: 'Sofia M.',
  },
  {
    id: 5,
    name: 'Sofia Moretti',
    rating: 6.8,
    rank: 5,
    wins: 10,
    losses: 6,
    matches: 16,
    winRate: 63,
    avatar: 'https://i.pravatar.cc/150?img=9',
    badge: 'INTERMEDIATE',
    trend: [5, 2, 5, 8, 9],
    bio: 'Creative player with excellent court vision.',
    bestPartner: 'Luca M.',
  },
  {
    id: 6,
    name: 'Andrea Greco',
    rating: 6.3,
    rank: 6,
    wins: 8,
    losses: 9,
    matches: 17,
    winRate: 47,
    avatar: 'https://i.pravatar.cc/150?img=18',
    badge: 'INTERMEDIATE',
    trend: [7, 5, 6, 4, 5],
    bio: 'Learning fast and improving every match.',
    bestPartner: 'Filippo S.',
  },
]

// Mock recent matches
export const recentMatches = [
  {
    id: 1,
    date: 'Oggi · 18:30',
    court: 'Campo 2 – Club Padel Master',
    mvp: 'Marco',
    teamA: {
      players: [
        { name: 'Luca', avatar: 'https://i.pravatar.cc/150?img=15' },
        { name: 'Marco', avatar: 'https://i.pravatar.cc/150?img=12' },
      ],
      sets: [6, 7],
      ratingChange: [+0.3, +0.3],
      won: true,
    },
    teamB: {
      players: [
        { name: 'Andrea', avatar: 'https://i.pravatar.cc/150?img=18' },
        { name: 'Filippo', avatar: 'https://i.pravatar.cc/150?img=20' },
      ],
      sets: [4, 5],
      ratingChange: [-0.2, -0.2],
      won: false,
    },
  },
  {
    id: 2,
    date: 'Ieri · 20:00',
    court: 'Campo 1 – The Smash Zone',
    mvp: null,
    teamA: {
      players: [
        { name: 'Elena', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Sofia', avatar: 'https://i.pravatar.cc/150?img=9' },
      ],
      sets: [6, 4, 7],
      ratingChange: [+0.5, +0.4],
      won: true,
    },
    teamB: {
      players: [
        { name: 'Tu', avatar: 'https://i.pravatar.cc/150?img=33' },
        { name: 'Luca', avatar: 'https://i.pravatar.cc/150?img=15' },
      ],
      sets: [3, 6, 4],
      ratingChange: [-0.2, -0.1],
      won: false,
    },
  },
  {
    id: 3,
    date: 'Lun · 21:00',
    court: 'Campo 3 – Central Arena',
    mvp: 'Tu',
    teamA: {
      players: [
        { name: 'Tu', avatar: 'https://i.pravatar.cc/150?img=33' },
        { name: 'Marco', avatar: 'https://i.pravatar.cc/150?img=12' },
      ],
      sets: [6, 6],
      ratingChange: [+0.4, +0.2],
      won: true,
    },
    teamB: {
      players: [
        { name: 'Andrea', avatar: 'https://i.pravatar.cc/150?img=18' },
        { name: 'Sofia', avatar: 'https://i.pravatar.cc/150?img=9' },
      ],
      sets: [2, 3],
      ratingChange: [-0.3, -0.2],
      won: false,
    },
  },
]

// Mock calendar matches
export const calendarMatches = [
  {
    id: 1,
    status: 'upcoming',
    month: 'Oct',
    day: 14,
    time: '18:30 – 20:00',
    court: 'Campo 2 - Club Padel Master',
    tag: 'Upcoming',
    teamA: {
      name: 'Team Shaka',
      players: [
        { avatar: 'https://i.pravatar.cc/150?img=12', rating: 8.2 },
        { avatar: 'https://i.pravatar.cc/150?img=15', rating: 7.5 },
      ],
    },
    teamB: {
      name: 'Top Spinners',
      players: [
        { avatar: 'https://i.pravatar.cc/150?img=5', rating: 8.0 },
        { avatar: 'https://i.pravatar.cc/150?img=9', rating: 7.9 },
      ],
    },
  },
  {
    id: 2,
    status: 'played',
    month: 'Oct',
    day: 12,
    time: '10:00 – 11:30',
    court: 'Campo 1 - Central Arena',
    tag: 'Risultati',
    score: '6 - 4',
    teamA: {
      name: 'Lobatones',
      players: [
        { avatar: 'https://i.pravatar.cc/150?img=20', rating: null },
        { avatar: 'https://i.pravatar.cc/150?img=22', rating: null },
      ],
    },
    teamB: {
      name: 'Team Shaka',
      players: [
        { avatar: 'https://i.pravatar.cc/150?img=33', rating: null },
        { avatar: 'https://i.pravatar.cc/150?img=18', rating: null },
      ],
    },
  },
  {
    id: 3,
    status: 'upcoming',
    month: 'Oct',
    day: 17,
    time: '21:00 – 22:30',
    court: 'Campo 5 - The Smash Zone',
    tag: 'League',
    teamA: {
      name: 'TBD',
      players: [],
    },
    teamB: {
      name: 'Team Shaka',
      players: [
        { avatar: 'https://i.pravatar.cc/150?img=12', rating: 8.2 },
        { avatar: 'https://i.pravatar.cc/150?img=15', rating: 7.5 },
      ],
    },
  },
]

// Mock pending approvals
export const pendingApprovals = [
  {
    id: 1,
    name: 'Alessandro Bianchi',
    avatar: 'https://i.pravatar.cc/150?img=25',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Elena Ferrari',
    avatar: 'https://i.pravatar.cc/150?img=47',
    status: 'pending',
  },
]
