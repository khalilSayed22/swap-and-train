import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/nav/BottomNav';
import { MatchModal } from './components/modals/MatchModal';

import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ChatListScreen, DMScreen } from './screens/ChatScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SessionPlanScreen } from './screens/SessionPlanScreen';
import { SafetyScreen } from './screens/SafetyScreen';

const TAB_SCREENS = ['discover', 'matches', 'chat', 'explore', 'profile'];

function AppShell() {
  const { activeScreen, showMatchModal, latestMatch, dismissMatchModal } = useApp();

  const showNav = TAB_SCREENS.includes(activeScreen);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'auth-login':
        return <AuthScreen mode="login" />;
      case 'auth-signup':
        return <AuthScreen mode="signup" />;
      case 'discover':
        return <DiscoverScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'chat':
        return <ChatListScreen />;
      case 'chat-dm':
        return <DMScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'session-plan':
        return <SessionPlanScreen />;
      case 'safety':
        return <SafetyScreen />;
      default:
        return <DiscoverScreen />;
    }
  };

  return (
    <div className="app-shell">
      {renderScreen()}
      {showNav && <BottomNav />}

      <MatchModal
        show={showMatchModal}
        matchedUser={latestMatch}
        onDismiss={dismissMatchModal}
      />
    </div>
  );
}

// Patch BottomNav to use our handleTabChange — we override via context's setActiveTab
// The BottomNav already calls setActiveTab; we also need it to call setActiveScreen.
// Solution: override setActiveTab in context to also update screen, but simpler is
// to sync activeTab → activeScreen inside AppShell via useEffect.
function AppShellWithSync() {
  const { activeTab, setActiveScreen, activeScreen } = useApp();

  // Keep screen in sync when tab changes from BottomNav
  React.useEffect(() => {
    if (activeTab === 'chat' && activeScreen !== 'chat' && activeScreen !== 'chat-dm') {
      setActiveScreen('chat');
    } else if (activeTab === 'discover' && activeScreen !== 'discover') {
      setActiveScreen('discover');
    } else if (activeTab === 'matches' && activeScreen !== 'matches') {
      setActiveScreen('matches');
    } else if (activeTab === 'explore' && activeScreen !== 'explore') {
      setActiveScreen('explore');
    } else if (activeTab === 'profile' && activeScreen !== 'profile' && activeScreen !== 'safety') {
      setActiveScreen('profile');
    }
  }, [activeTab]);

  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider>
      <AppShellWithSync />
    </AppProvider>
  );
}
