import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import type { User } from '../../types';
import { SportTag } from '../ui/Badges';
import { useApp } from '../../context/AppContext';

interface MatchModalProps {
  show: boolean;
  matchedUser: User | null;
  onDismiss: () => void;
}

export function MatchModal({ show, matchedUser, onDismiss }: MatchModalProps) {
  const { currentUser, conversations, setActiveTab, setSelectedConversation, setActiveScreen } = useApp();

  const openChat = () => {
    if (!matchedUser) return;
    const convo = conversations.find(c => c.user.id === matchedUser.id);
    if (convo) {
      setSelectedConversation(convo.id);
      setActiveScreen('chat-dm');
      setActiveTab('chat');
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      {show && matchedUser && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={onDismiss}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-8 w-full max-w-sm"
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Glow rings */}
            <div className="relative mb-8">
              <div
                className="absolute inset-0 rounded-full animate-pulse-ring"
                style={{ background: 'rgba(198,241,53,0.15)', width: 200, height: 200, top: -40, left: -40 }}
              />

              {/* Overlapping avatars */}
              <div className="flex items-center">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden border-4 relative z-10"
                  style={{ borderColor: '#C6F135', boxShadow: '0 0 30px rgba(198,241,53,0.4)' }}
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div
                  className="w-28 h-28 rounded-full overflow-hidden border-4 -ml-6"
                  style={{ borderColor: '#4F8EF7', boxShadow: '0 0 30px rgba(79,142,247,0.4)' }}
                >
                  <img src={matchedUser.avatar} alt={matchedUser.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Match icon */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl z-20"
                style={{ background: 'linear-gradient(135deg, #C6F135, #A8D020)', boxShadow: '0 0 20px rgba(198,241,53,0.5)' }}
              >
                ⚡
              </div>
            </div>

            {/* Text */}
            <div className="text-center mb-3">
              <span
                className="text-4xl font-black tracking-tight block mb-1"
                style={{
                  background: 'linear-gradient(135deg, #C6F135, #A8D020)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                It's a Match!
              </span>
              <p className="text-base" style={{ color: '#A0A0B0' }}>
                You and <span style={{ color: '#F0F0F5', fontWeight: 700 }}>{matchedUser.name}</span> both swiped right
              </p>
            </div>

            {/* Compatibility */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(198,241,53,0.1)', border: '1px solid rgba(198,241,53,0.25)' }}
            >
              <span style={{ color: '#C6F135', fontSize: 12 }}>⬡</span>
              <span className="text-sm font-bold" style={{ color: '#C6F135' }}>
                {matchedUser.compatibility}% compatibility
              </span>
            </div>

            {/* Sports in common */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {matchedUser.sports.map(sport => (
                <SportTag key={sport} sport={sport} size="md" />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={openChat}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base"
                style={{
                  background: 'linear-gradient(135deg, #C6F135, #A8D020)',
                  color: '#0A0A0F',
                }}
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                Send a message
              </button>
              <button
                onClick={onDismiss}
                className="w-full py-3.5 rounded-2xl font-medium text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#A0A0B0',
                }}
              >
                Keep swiping
              </button>
            </div>
          </motion.div>

          {/* Close */}
          <button
            onClick={onDismiss}
            className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <X size={18} style={{ color: '#A0A0B0' }} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
