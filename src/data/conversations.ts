import type { Conversation, Match } from '../types';
import { SEED_USERS } from './users';

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    user: SEED_USERS[0], // Yassine
    matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    conversationId: 'c1',
  },
  {
    id: 'm2',
    user: SEED_USERS[7], // Priya
    matchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    conversationId: 'c2',
  },
  {
    id: 'm3',
    user: SEED_USERS[8], // Marco
    matchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    conversationId: 'c3',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    matchId: 'm1',
    user: SEED_USERS[0],
    unread: 2,
    messages: [
      {
        id: 'msg1',
        senderId: 'u1',
        text: 'Hey! Saw we matched — solid compatibility. Which gym do you train at?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
      },
      {
        id: 'msg2',
        senderId: 'me',
        text: 'Hey Yassine! I go to PureGym in Bethnal Green. You?',
        timestamp: new Date(Date.now() - 85 * 60 * 1000),
      },
      {
        id: 'msg3',
        senderId: 'u1',
        text: 'Nice, I usually train at Hackney. Bit far but doable. Want to plan something this week?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 'msg4',
        senderId: 'u1',
        text: 'Thursday evening works for me — leg day? 🦵',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
      },
    ],
  },
  {
    id: 'c2',
    matchId: 'm2',
    user: SEED_USERS[7],
    unread: 0,
    messages: [
      {
        id: 'msg5',
        senderId: 'me',
        text: 'Morning Priya! Training for a triathlon sounds intense — how far along are you?',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
      },
      {
        id: 'msg6',
        senderId: 'u8',
        text: 'Hey! Sprint triathlon in June. Swim is my strongest. Looking for someone for early morning sessions — 6am kind of thing.',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'c3',
    matchId: 'm3',
    user: SEED_USERS[8],
    unread: 1,
    messages: [
      {
        id: 'msg7',
        senderId: 'u9',
        text: 'Planche or front lever first — which are you working on?',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000),
      },
      {
        id: 'msg8',
        senderId: 'me',
        text: 'Neither yet haha — more of a gym guy. But always wanted to learn calisthenics properly.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 120000),
      },
      {
        id: 'msg9',
        senderId: 'u9',
        text: 'Perfect — I can show you the basics. Camden parks on weekends?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];
