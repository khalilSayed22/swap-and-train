export type Sport =
  | 'Gym'
  | 'Running'
  | 'Football'
  | 'Basketball'
  | 'Tennis'
  | 'Boxing'
  | 'Cycling'
  | 'Swimming'
  | 'Calisthenics';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export type Goal =
  | 'Build Strength'
  | 'Lose Weight'
  | 'Stay Consistent'
  | 'Find Community'
  | 'Train for Competition'
  | 'Improve Endurance'
  | 'Learn Skills';

export type Availability =
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'Sun';

export type TimePreference = 'Morning' | 'Afternoon' | 'Evening';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  sports: Sport[];
  level: Level;
  distanceKm: number;
  bio: string;
  goals: Goal[];
  availability: Availability[];
  timePreference: TimePreference[];
  compatibility: number; // 0-100
  verified: boolean;
  reliabilityScore: number; // 0-100
  avatar: string;
  photos: string[];
  location: string;
  trainingStyle: string;
  sessionsCompleted?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type?: 'text' | 'session-proposal';
  sessionProposal?: SessionProposal;
}

export interface Conversation {
  id: string;
  matchId: string;
  user: User;
  messages: Message[];
  lastMessage?: Message;
  unread: number;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: Date;
  conversationId?: string;
}

export interface SessionProposal {
  id: string;
  sport: Sport;
  date: string;
  time: string;
  location: string;
  proposedById: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FilterState {
  sports: Sport[];
  maxDistance: number;
  levels: Level[];
  goals: Goal[];
  genderPreference: 'Anyone' | 'Male' | 'Female';
  availability: Availability[];
  timePreference: TimePreference[];
}

export type Screen =
  | 'onboarding'
  | 'auth-login'
  | 'auth-signup'
  | 'discover'
  | 'matches'
  | 'chat'
  | 'chat-dm'
  | 'explore'
  | 'profile'
  | 'session-plan'
  | 'safety';

export type TabScreen = 'discover' | 'matches' | 'chat' | 'explore' | 'profile';
