import React, { useState } from 'react';
import { ChevronLeft, Shield, CheckCircle2, AlertTriangle, Phone, Flag, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TIPS = [
  'Meet in public, well-lit locations for your first session.',
  'Tell a friend where you\'re going before meeting someone new.',
  'Trust your instincts — it\'s always okay to cancel.',
  'Use TrainMatch messaging instead of sharing personal numbers early on.',
];

export function SafetyScreen() {
  const { setActiveScreen } = useApp();
  const [reported, setReported] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <div className="screen-no-nav flex flex-col" style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button
          onClick={() => setActiveScreen('profile')}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ChevronLeft size={20} style={{ color: '#A0A0B0' }} />
        </button>
        <div>
          <h1 className="text-lg font-black" style={{ color: '#F0F0F5' }}>Safety & Trust</h1>
          <p className="text-xs" style={{ color: '#5A5A70' }}>Your account security</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-10">
        {/* Verification status */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(52,201,139,0.08)', border: '1px solid rgba(52,201,139,0.25)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(52,201,139,0.15)' }}
            >
              <Shield size={20} style={{ color: '#34C98B' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#F0F0F5' }}>
                {verified ? 'Fully Verified' : 'Basic Account'}
              </p>
              <p className="text-xs" style={{ color: '#5A5A70' }}>
                {verified ? 'ID + Phone confirmed' : 'Complete verification to unlock more matches'}
              </p>
            </div>
          </div>
          {!verified && (
            <button
              onClick={() => setVerified(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(52,201,139,0.15)', border: '1px solid rgba(52,201,139,0.3)', color: '#34C98B' }}
            >
              Verify My Identity
            </button>
          )}
          {verified && (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: '#34C98B' }} />
              <span className="text-sm font-semibold" style={{ color: '#34C98B' }}>Verification complete</span>
            </div>
          )}
        </div>

        {/* Safety tips */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(18,18,26,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#5A5A70' }}>
            Safety Tips
          </p>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black"
                  style={{ background: 'rgba(198,241,53,0.12)', color: '#C6F135' }}
                >
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#A0A0B0' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-2">
          <ActionRow
            icon={<Phone size={17} style={{ color: '#4F8EF7' }} />}
            label="Emergency Contacts"
            sublabel="Add contacts for urgent situations"
            bg="rgba(79,142,247,0.1)"
            border="rgba(79,142,247,0.2)"
          />
          <ActionRow
            icon={<AlertTriangle size={17} style={{ color: '#F59E0B' }} />}
            label="Block a User"
            sublabel="Prevent someone from contacting you"
            bg="rgba(245,158,11,0.08)"
            border="rgba(245,158,11,0.2)"
          />
          <button
            onClick={() => setReported(r => !r)}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl w-full text-left transition-all duration-200"
            style={{
              background: reported ? 'rgba(232,68,90,0.1)' : 'rgba(232,68,90,0.06)',
              border: `1px solid ${reported ? 'rgba(232,68,90,0.4)' : 'rgba(232,68,90,0.2)'}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(232,68,90,0.12)' }}
            >
              <Flag size={17} style={{ color: '#E8445A' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#E8445A' }}>
                {reported ? 'Report Submitted' : 'Report a User'}
              </p>
              <p className="text-xs" style={{ color: '#5A5A70' }}>
                {reported ? 'Our team will review this.' : 'Suspicious or unsafe behaviour'}
              </p>
            </div>
            {!reported && <ChevronRight size={16} style={{ color: '#5A5A70' }} />}
            {reported && <CheckCircle2 size={16} style={{ color: '#34C98B' }} />}
          </button>
        </div>

        {/* Privacy note */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(26,26,38,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#5A5A70' }}>
            Your location is only shared as a general area. We never share your exact address.{' '}
            <span style={{ color: '#4F8EF7' }}>Privacy Policy →</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionRow({
  icon, label, sublabel, bg, border
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  bg: string;
  border: string;
}) {
  return (
    <button
      className="flex items-center gap-3 px-4 py-4 rounded-2xl w-full text-left"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: '#F0F0F5' }}>{label}</p>
        <p className="text-xs" style={{ color: '#5A5A70' }}>{sublabel}</p>
      </div>
      <ChevronRight size={16} style={{ color: '#5A5A70' }} />
    </button>
  );
}
