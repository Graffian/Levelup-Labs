export const timeCommitmentConfig = {
  minimal: {
    name: 'Minimal Commitment',
    badge: { color: 'amber', text: 'YouTube Playlist' },
    description: 'Short, focused lessons perfect for busy schedules',
    sessionLength: '15-30 min sessions',
    gradient: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    intensity: 'Casual Explorer'
  },
  moderate: {
    name: 'Moderate Commitment',
    badge: { color: 'blue', text: 'YouTube Playlist' },
    description: 'Steady progress with comprehensive coverage',
    sessionLength: '30-60 min sessions',
    gradient: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    intensity: 'Consistent Learner'
  },
  significant: {
    name: 'Significant Commitment',
    badge: { color: 'green', text: 'YouTube Playlist' },
    description: 'In-depth exploration with hands-on projects',
    sessionLength: '1-2 hour sessions',
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    intensity: 'Dedicated Student'
  },
  intensive: {
    name: 'Intensive Commitment',
    badge: { color: 'purple', text: 'YouTube Playlist' },
    description: 'Comprehensive bootcamp-style learning experience',
    sessionLength: '2+ hour sessions',
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    intensity: 'Power Learner'
  }
} as const;
