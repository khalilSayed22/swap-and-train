import { motion } from 'framer-motion';
import { MessageCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SportTag, LevelBadge, CompatibilityBadge, VerifiedBadge } from '../components/ui/Badges';
import { formatDistance } from '../utils/sportConfig';
import type { Match } from '../types';

export function MatchesScreen() {
  const { matches, setSelectedConversation, setActiveScreen, conversations } = useApp();

  const openChat = (match: Match) => {
    const convo = conversations.find(c => c.user.id === match.user.id);
    if (convo) {
      setSelectedConversation(convo.id);
      setActiveScreen('chat-dm');
    }
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-xl font-black" style={{ color: '#F0F0F5' }}>Matches</h1>
        <p className="text-xs mt-0.5" style={{ color: '#5A5A70' }}>
          {matches.length} people ready to train
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
            style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            ⚡
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#F0F0F5' }}>No matches yet</h3>
          <p className="text-sm" style={{ color: '#5A5A70' }}>
            Head to Discover and start swiping to find your training partner.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-6">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(18,18,26,0.9)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Photo banner */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={match.user.photos[0]}
                    alt={match.user.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(18,18,26,1) 100%)' }}
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black" style={{ color: '#F0F0F5' }}>
                          {match.user.name}
                        </h3>
                        <span className="text-sm" style={{ color: '#A0A0B0' }}>{match.user.age}</span>
                        {match.user.verified && <VerifiedBadge />}
                      </div>
                    </div>
                    <CompatibilityBadge score={match.user.compatibility} />
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <MapPin size={11} style={{ color: '#5A5A70' }} />
                    <span className="text-xs" style={{ color: '#5A5A70' }}>
                      {match.user.location} · {formatDistance(match.user.distanceKm)}
                    </span>
                    <LevelBadge level={match.user.level} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {match.user.sports.map(sport => (
                      <SportTag key={sport} sport={sport} />
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#5A5A70' }}>
                    {match.user.bio}
                  </p>

                  <button
                    onClick={() => openChat(match)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #C6F135, #A8D020)',
                      color: '#0A0A0F',
                    }}
                  >
                    <MessageCircle size={15} strokeWidth={2.5} />
                    Message {match.user.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
