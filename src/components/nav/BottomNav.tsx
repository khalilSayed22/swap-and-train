import { Zap, Users, MessageCircle, Compass, User } from 'lucide-react';
import type { TabScreen } from '../../types';
import { useApp } from '../../context/AppContext';

type IconComponent = React.FC<{ size?: number; strokeWidth?: number; className?: string }>;

const TABS: { id: TabScreen; label: string; icon: IconComponent }[] = [
  { id: 'discover', label: 'Discover', icon: Zap },
  { id: 'matches', label: 'Matches', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { activeTab, setActiveTab, conversations } = useApp();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-2 pb-2 pt-1 z-50"
      style={{
        background: 'linear-gradient(to top, rgba(10,10,15,0.98) 70%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="flex items-center justify-around rounded-2xl px-1 py-2"
        style={{
          background: 'rgba(18,18,26,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const badge = id === 'chat' ? totalUnread : id === 'matches' ? 0 : 0;

          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative"
              style={{
                background: isActive ? 'rgba(198,241,53,0.1)' : 'transparent',
                minWidth: 56,
              }}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: '#C6F135', color: '#0A0A0F' }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: isActive ? '#C6F135' : '#5A5A70', transition: 'color 0.2s' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
