import type { Sport, Level } from '../types';

export const SPORT_CONFIG: Record<Sport, { emoji: string; color: string; bg: string; border: string }> = {
  Gym: {
    emoji: '🏋️',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.15)',
    border: 'rgba(255,107,53,0.35)',
  },
  Running: {
    emoji: '🏃',
    color: '#4F8EF7',
    bg: 'rgba(79,142,247,0.15)',
    border: 'rgba(79,142,247,0.35)',
  },
  Football: {
    emoji: '⚽',
    color: '#34C98B',
    bg: 'rgba(52,201,139,0.15)',
    border: 'rgba(52,201,139,0.35)',
  },
  Basketball: {
    emoji: '🏀',
    color: '#FF9F1C',
    bg: 'rgba(255,159,28,0.15)',
    border: 'rgba(255,159,28,0.35)',
  },
  Tennis: {
    emoji: '🎾',
    color: '#C6F135',
    bg: 'rgba(198,241,53,0.15)',
    border: 'rgba(198,241,53,0.35)',
  },
  Boxing: {
    emoji: '🥊',
    color: '#E8445A',
    bg: 'rgba(232,68,90,0.15)',
    border: 'rgba(232,68,90,0.35)',
  },
  Cycling: {
    emoji: '🚴',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.35)',
  },
  Swimming: {
    emoji: '🏊',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.15)',
    border: 'rgba(6,182,212,0.35)',
  },
  Calisthenics: {
    emoji: '🤸',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.35)',
  },
};

export const LEVEL_CONFIG: Record<Level, { color: string; bg: string; border: string; label: string }> = {
  Beginner: {
    color: '#34C98B',
    bg: 'rgba(52,201,139,0.12)',
    border: 'rgba(52,201,139,0.3)',
    label: 'Beginner',
  },
  Intermediate: {
    color: '#4F8EF7',
    bg: 'rgba(79,142,247,0.12)',
    border: 'rgba(79,142,247,0.3)',
    label: 'Intermediate',
  },
  Advanced: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    label: 'Advanced',
  },
};

export const ALL_SPORTS: Sport[] = [
  'Gym', 'Running', 'Football', 'Basketball', 'Tennis',
  'Boxing', 'Cycling', 'Swimming', 'Calisthenics'
];

export const ALL_GOALS = [
  'Build Strength',
  'Lose Weight',
  'Stay Consistent',
  'Find Community',
  'Train for Competition',
  'Improve Endurance',
  'Learn Skills',
] as const;

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km} km away`;
}

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
