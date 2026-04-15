import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  User,
  Match,
  Conversation,
  FilterState,
  Screen,
  TabScreen,
  Sport,
  Level,
  Goal,
  Availability,
  TimePreference,
  Message,
} from '../types';
import { SEED_USERS } from '../data/users';
import { INITIAL_MATCHES, INITIAL_CONVERSATIONS } from '../data/conversations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SupabaseUser } from '../lib/supabase';
import {
  getProfile,
  upsertProfile,
  getSwipedUserIds,
  saveSwipe,
  getMatches,
  saveMatch,
  getConversations,
  createConversation,
  getMessages,
  saveMessage,
  subscribeToMessages,
} from '../lib/database';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PendingOnboarding {
  sports: Sport[];
  level: Level;
  goals: Goal[];
  location: string;
}

interface AppContextType {
  authUser: SupabaseUser | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
  currentUser: User;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
  pendingOnboarding: PendingOnboarding | null;
  setPendingOnboarding: (data: PendingOnboarding | null) => void;
  discoverUsers: User[];
  matches: Match[];
  conversations: Conversation[];
  activeScreen: Screen;
  activeTab: TabScreen;
  selectedConversationId: string | null;
  showMatchModal: boolean;
  latestMatch: User | null;
  filters: FilterState;
  setActiveScreen: (screen: Screen) => void;
  setActiveTab: (tab: TabScreen) => void;
  setSelectedConversation: (id: string | null) => void;
  handleSwipeRight: (user: User) => void;
  handleSwipeLeft: (user: User) => void;
  dismissMatchModal: () => void;
  sendMessage: (conversationId: string, text: string) => void;
  updateFilters: (filters: FilterState) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultCurrentUser: User = {
  id: 'me',
  name: 'You',
  age: 24,
  gender: 'Male',
  sports: [],
  level: 'Intermediate',
  distanceKm: 0,
  bio: '',
  goals: [],
  availability: [],
  timePreference: [],
  compatibility: 100,
  verified: false,
  reliabilityScore: 80,
  avatar: '',
  photos: [],
  location: '',
  trainingStyle: '',
  sessionsCompleted: 0,
};

const defaultFilters: FilterState = {
  sports: [],
  maxDistance: 10,
  levels: [],
  goals: [],
  genderPreference: 'Anyone',
  availability: [],
  timePreference: [],
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(defaultCurrentUser);
  const [pendingOnboarding, setPendingOnboarding] = useState<PendingOnboarding | null>(null);
  const [baseDiscoverUsers, setBaseDiscoverUsers] = useState<User[]>(
    isSupabaseConfigured ? [] : SEED_USERS.slice(2),
  );
  const [matches, setMatches] = useState<Match[]>(
    isSupabaseConfigured ? [] : INITIAL_MATCHES,
  );
  const [conversations, setConversations] = useState<Conversation[]>(
    isSupabaseConfigured ? [] : INITIAL_CONVERSATIONS,
  );
  const [activeScreen, setActiveScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState<TabScreen>('discover');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [latestMatch, setLatestMatch] = useState<User | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // ─── Filtered discover users ─────────────────────────────────────────────────
  const discoverUsers = useMemo(() => {
    let result = baseDiscoverUsers;
    if (filters.sports.length > 0)
      result = result.filter(u => u.sports.some(s => filters.sports.includes(s)));
    if (filters.levels.length > 0)
      result = result.filter(u => filters.levels.includes(u.level));
    if (filters.goals.length > 0)
      result = result.filter(u => u.goals.some(g => filters.goals.includes(g)));
    if (filters.genderPreference !== 'Anyone')
      result = result.filter(u => u.gender === filters.genderPreference);
    if (filters.availability.length > 0)
      result = result.filter(u => u.availability.some(a => filters.availability.includes(a)));
    if (filters.timePreference.length > 0)
      result = result.filter(u => u.timePreference.some(t => filters.timePreference.includes(t)));
    result = result.filter(u => u.distanceKm <= filters.maxDistance);
    return result;
  }, [baseDiscoverUsers, filters]);

  // ─── Load user data ───────────────────────────────────────────────────────────
  const loadUserData = useCallback(async (userId: string) => {
    const swipedIds = await getSwipedUserIds(userId);
    setBaseDiscoverUsers(SEED_USERS.filter(u => !swipedIds.includes(u.id)));

    const profile = await getProfile(userId);
    if (profile) {
      setCurrentUser({
        id: 'me',
        name: profile.name || 'You',
        age: profile.age || 24,
        gender: (profile.gender as User['gender']) || 'Male',
        sports: (profile.sports ?? []) as Sport[],
        level: (profile.level as Level) || 'Intermediate',
        distanceKm: 0,
        bio: profile.bio || '',
        goals: (profile.goals ?? []) as Goal[],
        availability: (profile.availability ?? []) as Availability[],
        timePreference: (profile.time_preference ?? []) as TimePreference[],
        compatibility: 100,
        verified: profile.verified ?? false,
        reliabilityScore: profile.reliability_score ?? 80,
        avatar: profile.avatar || '',
        photos: profile.photos ?? [],
        location: profile.location || '',
        trainingStyle: profile.training_style || '',
        sessionsCompleted: profile.sessions_completed ?? 0,
      });
    }

    const dbMatches = await getMatches(userId);
    const hydratedMatches: Match[] = dbMatches
      .map(m => {
        const seedUser = SEED_USERS.find(u => u.id === m.matched_user_id);
        if (!seedUser) return null;
        return { id: m.id, user: seedUser, matchedAt: new Date(m.matched_at), conversationId: m.conversation_id };
      })
      .filter(Boolean) as Match[];
    setMatches(hydratedMatches);

    const dbConvos = await getConversations(userId);
    const hydratedConvos = await Promise.all(
      dbConvos.map(async c => {
        const seedUser = SEED_USERS.find(u => u.id === c.matched_user_id);
        if (!seedUser) return null;
        const dbMessages = await getMessages(c.id);
        const messages: Message[] = dbMessages.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.text,
          timestamp: new Date(m.created_at),
        }));
        return {
          id: c.id,
          matchId: c.id,
          user: seedUser,
          messages,
          lastMessage: messages[messages.length - 1],
          unread: c.unread_count,
        } satisfies Conversation;
      }),
    );
    setConversations(hydratedConvos.filter(Boolean) as Conversation[]);
  }, []);

  // ─── Auth lifecycle ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user) {
        loadUserData(user.id).then(() => {
          setActiveScreen('discover');
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setAuthUser(user);
        if (user) {
          await loadUserData(user.id);
          setActiveScreen('discover');
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(defaultCurrentUser);
          setBaseDiscoverUsers([]);
          setMatches([]);
          setConversations([]);
          setActiveScreen('onboarding');
          setFilters(defaultFilters);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  // ─── Actions ──────────────────────────────────────────────────────────────────

  const updateCurrentUser = useCallback(async (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    if (authUser && isSupabaseConfigured) {
      await upsertProfile(authUser.id, {
        name: updates.name,
        age: updates.age,
        gender: updates.gender,
        sports: updates.sports,
        level: updates.level,
        bio: updates.bio,
        goals: updates.goals,
        availability: updates.availability,
        time_preference: updates.timePreference,
        avatar: updates.avatar,
        photos: updates.photos,
        location: updates.location,
        training_style: updates.trainingStyle,
      });
    }
  }, [authUser]);

  const handleSwipeRight = useCallback(async (user: User) => {
    if (authUser && isSupabaseConfigured) await saveSwipe(authUser.id, user.id, 'right');
    setBaseDiscoverUsers(prev => prev.filter(u => u.id !== user.id));

    if (Math.random() > 0.3) {
      const convId = `conv_${Date.now()}`;
      const matchId = `match_${Date.now()}`;
      if (authUser && isSupabaseConfigured) {
        await saveMatch(authUser.id, user.id, convId);
        await createConversation(authUser.id, user.id, convId);
      }
      const newMatch: Match = { id: matchId, user, matchedAt: new Date(), conversationId: convId };
      const newConvo: Conversation = { id: convId, matchId, user, messages: [], unread: 0 };
      setMatches(prev => [newMatch, ...prev]);
      setConversations(prev => [newConvo, ...prev]);
      setLatestMatch(user);
      setShowMatchModal(true);
    }
  }, [authUser]);

  const handleSwipeLeft = useCallback(async (user: User) => {
    if (authUser && isSupabaseConfigured) await saveSwipe(authUser.id, user.id, 'left');
    setBaseDiscoverUsers(prev => prev.filter(u => u.id !== user.id));
  }, [authUser]);

  const dismissMatchModal = useCallback(() => {
    setShowMatchModal(false);
    setLatestMatch(null);
  }, []);

  const setSelectedConversation = useCallback((id: string | null) => {
    setSelectedConversationId(id);
    if (id) setConversations(prev => prev.map(c => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date(),
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: newMessage }
          : c,
      ),
    );
    if (authUser && isSupabaseConfigured) await saveMessage(conversationId, 'me', text);
  }, [authUser]);

  const updateFilters = useCallback((f: FilterState) => setFilters(f), []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      setActiveScreen('onboarding');
    }
  }, []);

  // ─── Realtime: live messages ───────────────────────────────────────────────
  useEffect(() => {
    if (!selectedConversationId || !isSupabaseConfigured) return;
    const sub = subscribeToMessages(selectedConversationId, (msg) => {
      if (msg.sender_id === 'me') return;
      const message: Message = {
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.text,
        timestamp: new Date(msg.created_at),
      };
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversationId
            ? { ...c, messages: [...c.messages, message], lastMessage: message }
            : c,
        ),
      );
    });
    return () => sub.unsubscribe();
  }, [selectedConversationId]);

  return (
    <AppContext.Provider
      value={{
        authUser,
        authLoading,
        signOut,
        currentUser,
        updateCurrentUser,
        pendingOnboarding,
        setPendingOnboarding,
        discoverUsers,
        matches,
        conversations,
        activeScreen,
        activeTab,
        selectedConversationId,
        showMatchModal,
        latestMatch,
        filters,
        setActiveScreen,
        setActiveTab,
        setSelectedConversation,
        handleSwipeRight,
        handleSwipeLeft,
        dismissMatchModal,
        sendMessage,
        updateFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
