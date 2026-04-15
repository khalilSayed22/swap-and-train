import type { Sport, Level } from '../../types';
import { SPORT_CONFIG, LEVEL_CONFIG } from '../../utils/sportConfig';

export function SportTag({ sport, size = 'sm' }: { sport: Sport; size?: 'sm' | 'md' }) {
  const config = SPORT_CONFIG[sport];
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px]'}`}
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}
    >
      <span>{config.emoji}</span>
      {sport}
    </span>
  );
}

export function LevelBadge({ level }: { level: Level }) {
  const config = LEVEL_CONFIG[level];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}
    >
      {config.label}
    </span>
  );
}

export function CompatibilityBadge({ score }: { score: number }) {
  const color = score >= 85 ? '#C6F135' : score >= 70 ? '#4F8EF7' : '#A0A0B0';
  const bg = score >= 85 ? 'rgba(198,241,53,0.12)' : score >= 70 ? 'rgba(79,142,247,0.12)' : 'rgba(255,255,255,0.06)';
  const border = score >= 85 ? 'rgba(198,241,53,0.3)' : score >= 70 ? 'rgba(79,142,247,0.3)' : 'rgba(255,255,255,0.1)';

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      <span style={{ fontSize: 8 }}>⬡</span>
      {score}% match
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: 'rgba(52,201,139,0.12)', border: '1px solid rgba(52,201,139,0.3)', color: '#34C98B' }}
    >
      ✓ Verified
    </span>
  );
}

export function AvailabilityPill({ day, active }: { day: string; active?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
      style={active
        ? { background: 'rgba(198,241,53,0.15)', border: '1px solid rgba(198,241,53,0.35)', color: '#C6F135' }
        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5A70' }
      }
    >
      {day}
    </span>
  );
}

export function ReliabilityBar({ score }: { score: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-text-muted">Reliability</span>
        <span className="text-[11px] font-bold" style={{ color: '#C6F135' }}>{score}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            background: 'linear-gradient(90deg, #C6F135, #A8D020)',
          }}
        />
      </div>
    </div>
  );
}
