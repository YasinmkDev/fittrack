export type MemberStatus = 'active' | 'expiring' | 'expired' | 'frozen';

export interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  detail: string;
}

export const PLANS: Plan[] = [
  { id: 'monthly', name: 'Monthly', months: 1, price: 3000, detail: 'Full gym access, all equipment' },
  { id: 'quarterly', name: 'Quarterly', months: 3, price: 8000, detail: 'Save Rs 1,000 vs monthly' },
  { id: 'annual', name: 'Annual', months: 12, price: 30000, detail: 'Best value — 2 months free' },
  { id: 'student', name: 'Student', months: 1, price: 2000, detail: 'Valid student card required' },
  { id: 'pt', name: 'Personal Training', months: 1, price: 15000, detail: '12 sessions with a coach' },
];

export const TRAINERS = ['Shahid Khan (Head Coach)', 'Bilal Ahmad', 'Usman Ali', 'Sana Bibi (Ladies)'];
export const GOALS = ['Weight loss', 'Muscle gain', 'General fitness', 'Strength', 'Sports performance'];

export interface Member {
  id: string;
  name: string;
  phone: string;
  planId: string;
  status: MemberStatus;
  joined: string;
  /** days left on current plan; negative = expired days ago */
  daysLeft: number;
  /** days in current plan period, for progress */
  planDays: number;
  feePaid: number;
  feeTotal: number;
  streakWeeks: number;
  visitsThisMonth: number;
  lastVisitDaysAgo: number;
  trainer: string;
  goal: string;
  weightSeries: { label: string; kg: number }[];
  attendanceNote: string;
}

export const MEMBERS: Member[] = [
  {
    id: 'm1', name: 'Adnan Khan', phone: '0345 911 2233', planId: 'annual', status: 'active',
    joined: 'Jan 2026', daysLeft: 74, planDays: 365, feePaid: 30000, feeTotal: 30000,
    streakWeeks: 9, visitsThisMonth: 18, lastVisitDaysAgo: 0, trainer: 'Shahid Khan (Head Coach)',
    goal: 'Muscle gain',
    weightSeries: [{ label: 'Jun', kg: 68 }, { label: 'Jul', kg: 70 }, { label: 'Aug', kg: 71.5 }, { label: 'Sep', kg: 73 }, { label: 'Oct', kg: 74.2 }],
    attendanceNote: 'Most consistent member this quarter.',
  },
  {
    id: 'm2', name: 'Fatima Noor', phone: '0333 822 9041', planId: 'quarterly', status: 'expiring',
    joined: 'Aug 2026', daysLeft: 3, planDays: 90, feePaid: 8000, feeTotal: 8000,
    streakWeeks: 6, visitsThisMonth: 14, lastVisitDaysAgo: 1, trainer: 'Sana Bibi (Ladies)',
    goal: 'Weight loss',
    weightSeries: [{ label: 'Aug', kg: 74 }, { label: 'Sep', kg: 71.8 }, { label: 'Oct', kg: 70.1 }],
    attendanceNote: 'Renews on time every cycle — send the renewal link today.',
  },
  {
    id: 'm3', name: 'Imran Ullah', phone: '0300 765 1188', planId: 'monthly', status: 'expired',
    joined: 'Mar 2026', daysLeft: -6, planDays: 30, feePaid: 0, feeTotal: 3000,
    streakWeeks: 0, visitsThisMonth: 2, lastVisitDaysAgo: 11, trainer: 'Bilal Ahmad',
    goal: 'General fitness',
    weightSeries: [{ label: 'Aug', kg: 82 }, { label: 'Sep', kg: 81.2 }, { label: 'Oct', kg: 81.6 }],
    attendanceNote: 'No visit in 11 days and fee overdue — highest churn risk.',
  },
  {
    id: 'm4', name: 'Hamza Tariq', phone: '0346 555 7812', planId: 'pt', status: 'active',
    joined: 'Sep 2026', daysLeft: 19, planDays: 30, feePaid: 15000, feeTotal: 15000,
    streakWeeks: 4, visitsThisMonth: 12, lastVisitDaysAgo: 0, trainer: 'Shahid Khan (Head Coach)',
    goal: 'Strength',
    weightSeries: [{ label: 'Sep', kg: 76 }, { label: 'Oct', kg: 77.4 }],
    attendanceNote: 'PT client. Deadlift up 20 kg since joining.',
  },
  {
    id: 'm5', name: 'Ayesha Bibi', phone: '0312 440 6620', planId: 'student', status: 'active',
    joined: 'Jul 2026', daysLeft: 12, planDays: 30, feePaid: 2000, feeTotal: 2000,
    streakWeeks: 11, visitsThisMonth: 16, lastVisitDaysAgo: 1, trainer: 'Sana Bibi (Ladies)',
    goal: 'General fitness',
    weightSeries: [{ label: 'Jul', kg: 58 }, { label: 'Aug', kg: 57.5 }, { label: 'Sep', kg: 57.9 }, { label: 'Oct', kg: 57.2 }],
    attendanceNote: 'Ladies batch regular. Longest active streak in the gym.',
  },
  {
    id: 'm6', name: 'Zubair Ahmad', phone: '0334 908 3371', planId: 'quarterly', status: 'frozen',
    joined: 'May 2026', daysLeft: 41, planDays: 90, feePaid: 8000, feeTotal: 8000,
    streakWeeks: 0, visitsThisMonth: 0, lastVisitDaysAgo: 23, trainer: 'Usman Ali',
    goal: 'Weight loss',
    weightSeries: [{ label: 'Jul', kg: 95 }, { label: 'Aug', kg: 92.4 }, { label: 'Sep', kg: 90.8 }],
    attendanceNote: 'Frozen for travel until 5 Nov. Fee fully paid.',
  },
  {
    id: 'm7', name: 'Daniyal Shah', phone: '0301 623 8845', planId: 'monthly', status: 'expiring',
    joined: 'Oct 2026', daysLeft: 2, planDays: 30, feePaid: 3000, feeTotal: 3000,
    streakWeeks: 3, visitsThisMonth: 9, lastVisitDaysAgo: 2, trainer: 'Bilal Ahmad',
    goal: 'Muscle gain',
    weightSeries: [{ label: 'Oct', kg: 65 }],
    attendanceNote: 'New member, good first month. Offer Quarterly upgrade at renewal.',
  },
  {
    id: 'm8', name: 'Maryam Gul', phone: '0345 270 9914', planId: 'annual', status: 'active',
    joined: 'Feb 2026', daysLeft: 112, planDays: 365, feePaid: 20000, feeTotal: 30000,
    streakWeeks: 7, visitsThisMonth: 15, lastVisitDaysAgo: 0, trainer: 'Sana Bibi (Ladies)',
    goal: 'Weight loss',
    weightSeries: [{ label: 'Jun', kg: 71 }, { label: 'Jul', kg: 69.2 }, { label: 'Aug', kg: 67.8 }, { label: 'Sep', kg: 66.1 }, { label: 'Oct', kg: 64.9 }],
    attendanceNote: 'Down 6.1 kg since June. Annual plan on installments — Rs 10,000 balance.',
  },
];

export interface GymClass {
  id: string;
  name: string;
  trainer: string;
  time: string;
  booked: number;
  capacity: number;
  state: 'done' | 'live' | 'upcoming';
}

export const CLASSES_TODAY: GymClass[] = [
  { id: 'k1', name: 'Morning Strength', trainer: 'Shahid Khan', time: '6:00 – 7:30 AM', booked: 18, capacity: 20, state: 'done' },
  { id: 'k2', name: 'Ladies Fitness Batch', trainer: 'Sana Bibi', time: '11:00 AM – 12:00 PM', booked: 14, capacity: 15, state: 'done' },
  { id: 'k3', name: 'Cardio & HIIT', trainer: 'Bilal Ahmad', time: '5:00 – 6:00 PM', booked: 16, capacity: 18, state: 'live' },
  { id: 'k4', name: 'Powerlifting Club', trainer: 'Shahid Khan', time: '6:30 – 8:00 PM', booked: 9, capacity: 12, state: 'upcoming' },
  { id: 'k5', name: 'Functional & Mobility', trainer: 'Usman Ali', time: '8:15 – 9:00 PM', booked: 7, capacity: 16, state: 'upcoming' },
];

export const PT_SESSIONS = [
  { id: 'pt1', member: 'Hamza Tariq', trainer: 'Shahid Khan', when: 'Today, 7:00 PM', focus: 'Deadlift form check' },
  { id: 'pt2', member: 'Maryam Gul', trainer: 'Sana Bibi', when: 'Tomorrow, 10:00 AM', focus: 'Weekly weigh-in + plan review' },
];

export interface FeePayment {
  id: string;
  memberId: string;
  name: string;
  amount: number;
  method: 'Cash' | 'JazzCash' | 'Bank transfer';
  when: string;
  kind: 'New plan' | 'Renewal' | 'Installment';
}

export const PAYMENTS: FeePayment[] = [
  { id: 'p1', memberId: 'm4', name: 'Hamza Tariq', amount: 15000, method: 'Bank transfer', when: 'Today', kind: 'New plan' },
  { id: 'p2', memberId: 'm7', name: 'Daniyal Shah', amount: 3000, method: 'Cash', when: 'Today', kind: 'New plan' },
  { id: 'p3', memberId: 'm2', name: 'Fatima Noor', amount: 8000, method: 'JazzCash', when: 'Yesterday', kind: 'Renewal' },
  { id: 'p4', memberId: 'm8', name: 'Maryam Gul', amount: 10000, method: 'Bank transfer', when: '17 Oct', kind: 'Installment' },
];

export const GYM = {
  name: 'PowerHouse Gym',
  area: 'Mingora, Swat',
  owner: 'Yasin',
  inGymNow: 23,
  capacityNow: 60,
  checkinsToday: 86,
  feesCollected: 412000,
  feesTarget: 550000,
  feesOutstanding: 47000,
  overdueMembers: 4,
  totalMembers: 186,
  newThisMonth: 21,
  /** check-ins per day, Mon..Sun; last entry is today */
  attendanceWeek: [64, 78, 71, 92, 84, 96, 86],
  attendanceDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export function planById(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function memberById(id: string): Member | undefined {
  return MEMBERS.find((m) => m.id === id);
}
