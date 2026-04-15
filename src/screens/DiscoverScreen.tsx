import { AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SwipeCard, SwipeButtons } from '../components/swipe/SwipeCard';

export function DiscoverScreen() {
  const {
    discoverUsers,
    handleSwipeLeft,
    handleSwipeRight,
    filters,
    setActiveTab,
  } = useApp();

  const visibleCards = discoverUsers.slice(0, 3);

  return (
    <div className="screen flex flex-col" style={{ paddingBottom: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F0F5' }}>
            Discover
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#5A5A70' }}>
            {discoverUsers.length} partners near you
          </p>
        </div>
        <button
          onClick={() => setActiveTab('explore')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(26,26,38,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <SlidersHorizontal size={18} style={{ color: '#A0A0B0' }} />
        </button>
      </div>

      {/* Active filters chips */}
      {filters.sports.length > 0 && (
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar flex-shrink-0">
          {filters.sports.map(sport => (
            <span
              key={sport}
              className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
              style={{
                background: 'rgba(198,241,53,0.1)',
                border: '1px solid rgba(198,241,53,0.25)',
                color: '#C6F135',
              }}
            >
              {sport}
            </span>
          ))}
        </div>
      )}

      {/* Swipe stack */}
      <div className="flex-1 px-4 relative" style={{ minHeight: 0 }}>
        {discoverUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative w-full h-full" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            <AnimatePresence>
              {visibleCards.map((user, index) => (
                <SwipeCard
                  key={user.id}
                  user={user}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isTop={index === 0}
                  stackIndex={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {discoverUsers.length > 0 && (
        <div className="flex-shrink-0 px-5 pb-28 pt-5">
          <SwipeButtons
            onPass={() => discoverUsers[0] && handleSwipeLeft(discoverUsers[0])}
            onMatch={() => discoverUsers[0] && handleSwipeRight(discoverUsers[0])}
          />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
        style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        🔍
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#F0F0F5' }}>
        You've seen everyone!
      </h3>
      <p className="text-sm mb-6" style={{ color: '#5A5A70' }}>
        Check back later or broaden your filters.
      </p>
      <button
        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
        style={{
          background: 'rgba(198,241,53,0.1)',
          border: '1px solid rgba(198,241,53,0.25)',
          color: '#C6F135',
        }}
      >
        <RefreshCw size={15} />
        Refresh
      </button>
    </div>
  );
}
