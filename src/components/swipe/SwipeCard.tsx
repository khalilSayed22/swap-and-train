import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { MapPin, Clock, CheckCircle2, X, Heart } from 'lucide-react';
import type { User } from '../../types';
import { SportTag, LevelBadge, CompatibilityBadge, VerifiedBadge, AvailabilityPill } from '../ui/Badges';
import { formatDistance } from '../../utils/sportConfig';

interface SwipeCardProps {
  user: User;
  onSwipeLeft: (user: User) => void;
  onSwipeRight: (user: User) => void;
  isTop: boolean;
  stackIndex: number;
}

const SWIPE_THRESHOLD = 100;

export function SwipeCard({ user, onSwipeLeft, onSwipeRight, isTop, stackIndex }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [30, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.98, 1, 0.98]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 600) {
      onSwipeRight(user);
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -600) {
      onSwipeLeft(user);
    }
  };

  const stackOffset = stackIndex * 8;
  const stackScale = 1 - stackIndex * 0.04;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: isTop ? cardScale : stackScale,
        zIndex: 10 - stackIndex,
        y: stackOffset,
        originX: 0.5,
        originY: 1,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
      initial={{ scale: stackScale, y: stackOffset }}
      animate={{ scale: isTop ? 1 : stackScale, y: stackOffset }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Card */}
      <div
        className="w-full h-full rounded-3xl overflow-hidden relative select-none"
        style={{
          boxShadow: isTop ? '0 25px 60px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.4)',
          background: '#12121A',
        }}
      >
        {/* Photo */}
        <div className="absolute inset-0">
          <img
            src={user.photos[0]}
            alt={user.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,15,0.7) 65%, rgba(10,10,15,0.98) 100%)',
          }}
        />

        {/* LIKE stamp */}
        {isTop && (
          <motion.div
            className="absolute top-14 left-6 px-4 py-2 rounded-xl border-2 font-black text-2xl tracking-widest rotate-[-25deg]"
            style={{
              opacity: likeOpacity,
              borderColor: '#C6F135',
              color: '#C6F135',
              textShadow: '0 0 20px rgba(198,241,53,0.5)',
            }}
          >
            MATCH
          </motion.div>
        )}

        {/* NOPE stamp */}
        {isTop && (
          <motion.div
            className="absolute top-14 right-6 px-4 py-2 rounded-xl border-2 font-black text-2xl tracking-widest rotate-[25deg]"
            style={{
              opacity: nopeOpacity,
              borderColor: '#E8445A',
              color: '#E8445A',
              textShadow: '0 0 20px rgba(232,68,90,0.5)',
            }}
          >
            PASS
          </motion.div>
        )}

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <CompatibilityBadge score={user.compatibility} />
          {user.verified && <VerifiedBadge />}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
          {/* Name row */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: '#F0F0F5' }}>
                {user.name}
                <span className="text-xl font-semibold ml-2" style={{ color: '#A0A0B0' }}>
                  {user.age}
                </span>
              </h2>
            </div>
            <LevelBadge level={user.level} />
          </div>

          {/* Location + distance */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={12} style={{ color: '#5A5A70' }} />
            <span className="text-xs" style={{ color: '#5A5A70' }}>
              {user.location} · {formatDistance(user.distanceKm)}
            </span>
          </div>

          {/* Sports */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {user.sports.map(sport => (
              <SportTag key={sport} sport={sport} size="md" />
            ))}
          </div>

          {/* Bio */}
          <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: '#A0A0B0' }}>
            {user.bio}
          </p>

          {/* Availability */}
          <div className="flex items-center gap-1.5">
            <Clock size={11} style={{ color: '#5A5A70' }} />
            <div className="flex gap-1 flex-wrap">
              {(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const).map(day => (
                <AvailabilityPill
                  key={day}
                  day={day}
                  active={user.availability.includes(day)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onPass: () => void;
  onMatch: () => void;
}

export function SwipeButtons({ onPass, onMatch }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onPass}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
        style={{
          background: 'rgba(232,68,90,0.12)',
          border: '1.5px solid rgba(232,68,90,0.3)',
        }}
      >
        <X size={26} style={{ color: '#E8445A' }} strokeWidth={2.5} />
      </button>

      <button
        onClick={onMatch}
        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
        style={{
          background: 'linear-gradient(135deg, #C6F135, #A8D020)',
          boxShadow: '0 0 30px rgba(198,241,53,0.35)',
        }}
      >
        <Heart size={30} style={{ color: '#0A0A0F' }} strokeWidth={2.5} fill="#0A0A0F" />
      </button>

      <button
        onClick={() => {}}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
        style={{
          background: 'rgba(79,142,247,0.12)',
          border: '1.5px solid rgba(79,142,247,0.3)',
        }}
      >
        <CheckCircle2 size={22} style={{ color: '#4F8EF7' }} strokeWidth={2} />
      </button>
    </div>
  );
}
