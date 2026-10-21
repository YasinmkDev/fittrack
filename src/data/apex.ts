/**
 * APEX Studio Lab content — taken verbatim from the owner's reference
 * designs (Command Hub, Athlete Roster, Floor Schedule, Leaderboard).
 */

export const STUDIO = { name: 'APEX Studio Lab' };

export const HUB = {
  occupancyPct: 78,
  activeAthletes: 39,
  capacity: 50,
  surgeNote: 'Surge wave predicted at 18:30 EST',
  soundDb: 88,
  soundState: 'Optimal',
  airPpm: 492,
  revenue: '$4,820',
  revenueDelta: '+18.4%',
  checkins: 142,
  checkinsCap: 180,
  retention: '96.2%',
};

export interface RadarAthlete {
  id: string;
  initials: string;
  name: string;
  detail: string;
  badge: 'orange' | 'red';
}

export const RETENTION_RADAR: RadarAthlete[] = [
  { id: 'ra1', initials: 'DL', name: 'Devon Lane', detail: 'Absent 11 days • Prev: 4x/wk', badge: 'orange' },
  { id: 'ra2', initials: 'TK', name: 'Tara Kowalski', detail: 'Absent 14 days • Injury flag', badge: 'red' },
];

export interface Milestone {
  id: string;
  icon: 'trophy' | 'flame';
  name: string;
  when: string;
  text: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'ms1',
    icon: 'trophy',
    name: 'Marcus V.',
    when: '4m ago',
    text: 'Logged 405 lb Deadlift (Personal Record) in Rack 4',
  },
  {
    id: 'ms2',
    icon: 'flame',
    name: 'Elena R.',
    when: '18m ago',
    text: 'Achieved 10th consecutive day attendance streak',
  },
];

export interface Athlete {
  id: string;
  name: string;
  photo: string;
  program: string;
  status: string;
  statusTone: 'neutral' | 'rust' | 'done';
  stats: { label: string; value: string }[];
  footerIcon: 'clock' | 'sync' | 'verified';
  footerText: string;
  action: string;
  actionStyle: 'primary' | 'muted';
  cohort: string[];
}

export const ATHLETES: Athlete[] = [
  {
    id: 'a1',
    name: 'Marcus Vance',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    program: 'Hypertrophy & Power • Block B',
    status: 'On Schedule',
    statusTone: 'neutral',
    stats: [
      { label: 'Load', value: '740 AU' },
      { label: 'Sleep Eff.', value: '91%' },
      { label: 'Hydration', value: 'Optimal' },
    ],
    footerIcon: 'clock',
    footerText: 'Session: 14:30 Today',
    action: 'Protocol',
    actionStyle: 'primary',
    cohort: ['all', 'vip'],
  },
  {
    id: 'a2',
    name: 'Liam Chen',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg',
    program: 'Metabolic Conditioning • Meso 2',
    status: 'Rest Day',
    statusTone: 'rust',
    stats: [
      { label: 'Strain', value: '14.8' },
      { label: 'HRV', value: '104 ms' },
      { label: 'RPE Avg', value: '7.2' },
    ],
    footerIcon: 'sync',
    footerText: 'Synced 12m ago',
    action: 'Nudge',
    actionStyle: 'muted',
    cohort: ['all', 'recovery'],
  },
  {
    id: 'a3',
    name: 'Chloe Bennett',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    program: 'VO2 Max Peaking • Week 6',
    status: 'Completed',
    statusTone: 'done',
    stats: [
      { label: 'Pace Avg', value: "3'42\" /km" },
      { label: 'Lactate', value: '2.1 mmol' },
      { label: 'Streak', value: '18 Days' },
    ],
    footerIcon: 'verified',
    footerText: 'Data Verified',
    action: 'Review',
    actionStyle: 'primary',
    cohort: ['all', 'streaks'],
  },
];

export const SPOTLIGHT = {
  name: 'Elena Rostova',
  program: 'Olympic Decathlon Prep',
  tier: 'Tier 1 Elite',
  streak: '24 Days',
  vo2Delta: '+4.2%',
  readiness: 94,
  hrv: '88ms',
};

export interface Session {
  id: string;
  time: string;
  duration: string;
  badge?: string;
  badgeTone: 'rust' | 'gray' | 'blue';
  name: string;
  location: string;
  coach?: string;
  coachRole?: string;
  coachPhoto?: string;
  rightTop?: string;
  rightBottom?: string;
  action?: 'checkin' | 'details';
  variant?: 'telemetry';
}

export const SESSIONS: Session[] = [
  {
    id: 's1',
    time: '06:30 AM',
    duration: '60 min',
    badge: 'SOLD OUT',
    badgeTone: 'rust',
    name: 'Hyrox Conditioning',
    location: 'Main Turf & Ergometers • Zone A',
    coach: 'Jax Walker',
    coachRole: 'Head Coach',
    coachPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    rightTop: '24/24',
    rightBottom: 'Waitlist (4)',
  },
  {
    id: 's2',
    time: '08:00 AM',
    duration: '45 min',
    badge: '2 Spots Left',
    badgeTone: 'gray',
    name: 'Metcon Shred',
    location: 'Cross-Training Rig • Zone C',
    coach: 'Sarah Connor',
    coachRole: 'Master Coach',
    coachPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    action: 'checkin',
  },
  {
    id: 's3',
    time: '11:00 AM',
    duration: '90 min',
    badge: 'Telemetry Active',
    badgeTone: 'blue',
    name: 'VIP 1-on-1 PT Block',
    location: 'Bio-Lab Recovery & Private Deck',
    variant: 'telemetry',
  },
  {
    id: 's4',
    time: '05:30 PM',
    duration: '75 min',
    badge: 'Open (12/16)',
    badgeTone: 'gray',
    name: 'Olympic Weightlifting',
    location: 'Lifting Platforms 1–6',
    coach: 'David Miller',
    coachRole: 'Barbell Specialist',
    coachPhoto: 'https://randomuser.me/api/portraits/men/85.jpg',
    action: 'details',
  },
];

export const WEEK = [
  { day: 'Mon', date: '21' },
  { day: 'Tue', date: '22' },
  { day: 'Wed', date: '23' },
  { day: 'Thu', date: '24' },
  { day: 'Fri', date: '25' },
  { day: 'Sat', date: '26' },
];

export const TRAINERS = {
  leader: {
    name: 'Jax Walker',
    role: 'Master Coach',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    earnings: '$8,450',
    retention: '98% Retention',
  },
  second: {
    name: 'Sarah C.',
    role: 'Strength',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    earnings: '$7,120',
    retention: '94% Ret.',
  },
  third: {
    name: 'David M.',
    role: 'Mobility',
    photo: 'https://randomuser.me/api/portraits/men/85.jpg',
    earnings: '$6,890',
    retention: '92% Ret.',
  },
};

export const CONTENDERS = [
  {
    rank: 1,
    name: 'Alex K.',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg',
    sessions: '28 Sessions Logged',
    xp: '4,820 XP',
    xpNote: '+340 XP today',
    xpNoteRust: true,
  },
  {
    rank: 2,
    name: 'Nina T.',
    photo: 'https://randomuser.me/api/portraits/women/17.jpg',
    sessions: '26 Sessions Logged',
    xp: '4,690 XP',
    xpNote: '130 XP gap',
    xpNoteRust: false,
  },
  {
    rank: 3,
    name: 'Marcus V.',
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    sessions: '25 Sessions Logged',
    xp: '4,510 XP',
    xpNote: '180 XP gap',
    xpNoteRust: false,
  },
];

export const TOURNAMENT = {
  title: 'October 30-Day Shred Battle',
  subtitle: 'Cross-studio athletic milestone tournament',
  prize: '$2,500 Prize Pool',
  image:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  day: 'Day 24 of 30',
  completed: '80% Completed',
  progress: 0.8,
  started: 'Started Oct 1',
  ends: 'Ends in 6 days',
};
