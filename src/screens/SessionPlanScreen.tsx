import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Sport } from '../types';
import { SPORT_CONFIG, ALL_SPORTS } from '../utils/sportConfig';

export function SessionPlanScreen() {
  const { setActiveScreen, conversations, selectedConversationId, sendMessage } = useApp();

  const convo = conversations.find(c => c.id === selectedConversationId);

  const [sport, setSport] = useState<Sport>('Gym');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [sent, setSent] = useState(false);

  const isValid = sport && date && time && location.trim();

  const handleSend = () => {
    if (!isValid || !convo) return;
    const msg = `📅 Session Proposal\n🏋️ Sport: ${sport}\n📍 Location: ${location}\n🗓 Date: ${date} at ${time}`;
    sendMessage(convo.id, msg);
    setSent(true);
    setTimeout(() => {
      setActiveScreen('chat-dm');
    }, 1200);
  };

  return (
    <div className="screen-no-nav flex flex-col" style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button
          onClick={() => setActiveScreen('chat-dm')}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ChevronLeft size={20} style={{ color: '#A0A0B0' }} />
        </button>
        <div>
          <h1 className="text-lg font-black" style={{ color: '#F0F0F5' }}>Plan a Session</h1>
          {convo && (
            <p className="text-xs" style={{ color: '#5A5A70' }}>with {convo.user.name}</p>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-5 pb-8">
        {/* Sport picker */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#5A5A70' }}>
            Sport
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_SPORTS.map(s => {
              const config = SPORT_CONFIG[s];
              const active = sport === s;
              return (
                <button
                  key={s}
                  onClick={() => setSport(s)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? config.bg : 'rgba(26,26,38,0.6)',
                    border: `1px solid ${active ? config.border : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-[10px] font-semibold" style={{ color: active ? config.color : '#5A5A70' }}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5A5A70' }}>
            Date
          </p>
          <div className="relative">
            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5A5A70' }} />
            <input
              type="date"
              className="input-field pl-10"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5A5A70' }}>
            Time
          </p>
          <div className="relative">
            <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5A5A70' }} />
            <input
              type="time"
              className="input-field pl-10"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5A5A70' }}>
            Location / Venue
          </p>
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5A5A70' }} />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="e.g. PureGym Bethnal Green"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Preview card */}
        {isValid && (
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(198,241,53,0.06)', border: '1px solid rgba(198,241,53,0.2)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#C6F135' }}>
              Session Preview
            </p>
            <div className="flex flex-col gap-1.5">
              <Row icon="🏋️" label={sport} />
              <Row icon="📍" label={location} />
              <Row icon="🗓" label={`${date} at ${time}`} />
              {convo && <Row icon="👤" label={convo.user.name} />}
            </div>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!isValid || sent}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base mt-auto transition-all duration-200"
          style={{
            background: sent
              ? 'rgba(52,201,139,0.2)'
              : isValid
              ? 'linear-gradient(135deg, #C6F135, #A8D020)'
              : 'rgba(198,241,53,0.15)',
            color: sent ? '#34C98B' : isValid ? '#0A0A0F' : '#5A5A70',
            border: sent ? '1px solid rgba(52,201,139,0.3)' : 'none',
          }}
        >
          {sent ? (
            <>
              <Check size={18} strokeWidth={2.5} />
              Proposal Sent!
            </>
          ) : (
            <>
              <Send size={17} strokeWidth={2.5} />
              Send Proposal
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-base w-5 text-center">{icon}</span>
      <span className="text-sm font-medium" style={{ color: '#A0A0B0' }}>{label}</span>
    </div>
  );
}
