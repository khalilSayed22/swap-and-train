import { useState } from 'react';
import { Edit3, Shield, LogOut, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SportTag, LevelBadge, VerifiedBadge, AvailabilityPill, ReliabilityBar } from '../components/ui/Badges';
import type { Availability } from '../types';

const DAYS: Availability[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ProfileScreen() {
  const { currentUser, updateCurrentUser, signOut, setActiveScreen } = useApp();
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);

  const handleSaveBio = async () => {
    await updateCurrentUser({ bio });
    setEditBio(false);
  };

  return (
    <div className="screen">
      {/* Hero section */}
      <div className="relative">
        {/* Cover photo */}
        <div className="relative h-52 overflow-hidden">
          {currentUser.photos[0] ? (
            <img
              src={currentUser.photos[0]}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, rgba(198,241,53,0.15), rgba(79,142,247,0.1))' }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.8) 100%)' }}
          />
        </div>

        {/* Avatar overlay */}
        <div className="px-5 pb-4">
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div
              className="w-24 h-24 rounded-3xl overflow-hidden border-4 flex items-center justify-center text-3xl font-black"
              style={{
                borderColor: '#0A0A0F',
                boxShadow: '0 0 0 2px rgba(198,241,53,0.3)',
                background: 'rgba(26,26,38,0.9)',
                color: '#C6F135',
              }}
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setActiveScreen('safety')}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(26,26,38,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Shield size={16} style={{ color: '#34C98B' }} />
              </button>
              <button
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold"
                style={{
                  background: 'rgba(198,241,53,0.12)',
                  border: '1px solid rgba(198,241,53,0.3)',
                  color: '#C6F135',
                }}
              >
                <Edit3 size={12} />
                Edit
              </button>
            </div>
          </div>

          {/* Name + badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-black" style={{ color: '#F0F0F5' }}>
              {currentUser.name || 'Your Name'}
            </h1>
            {currentUser.age > 0 && (
              <span className="text-base font-semibold" style={{ color: '#5A5A70' }}>
                {currentUser.age}
              </span>
            )}
            {currentUser.verified && <VerifiedBadge />}
          </div>

          {currentUser.location && (
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={12} style={{ color: '#5A5A70' }} />
              <span className="text-xs" style={{ color: '#5A5A70' }}>{currentUser.location}</span>
            </div>
          )}

          {/* Sports */}
          {currentUser.sports.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {currentUser.sports.map(sport => (
                <SportTag key={sport} sport={sport} size="md" />
              ))}
              <LevelBadge level={currentUser.level} />
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5">
        <div
          className="grid grid-cols-3 divide-x rounded-2xl overflow-hidden"
          style={{ background: 'rgba(18,18,26,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { label: 'Sessions', value: currentUser.sessionsCompleted ?? 0, icon: '🏋️' },
            { label: 'Reliability', value: `${currentUser.reliabilityScore}%`, icon: '⚡' },
            { label: 'Compatibility', value: `${currentUser.compatibility}%`, icon: '⬡' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-4 px-2">
              <span className="text-lg mb-0.5">{stat.icon}</span>
              <span className="text-lg font-black" style={{ color: '#C6F135' }}>{stat.value}</span>
              <span className="text-[10px] font-semibold" style={{ color: '#5A5A70' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-8">
        {/* Bio */}
        <Card label="About">
          {editBio ? (
            <div>
              <textarea
                className="input-field text-sm resize-none"
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveBio}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C6F135, #A8D020)', color: '#0A0A0F' }}
                >
                  Save
                </button>
                <button
                  onClick={() => { setBio(currentUser.bio); setEditBio(false); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5A70' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: '#A0A0B0' }}>
                {bio || 'Add a bio to help partners find you.'}
              </p>
              <button
                onClick={() => setEditBio(true)}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: '#C6F135' }}
              >
                <Edit3 size={11} /> Edit bio
              </button>
            </div>
          )}
        </Card>

        {/* Training style */}
        {currentUser.trainingStyle && (
          <Card label="Training Style">
            <p className="text-sm" style={{ color: '#A0A0B0' }}>{currentUser.trainingStyle}</p>
          </Card>
        )}

        {/* Goals */}
        {currentUser.goals.length > 0 && (
          <Card label="Goals">
            <div className="flex flex-wrap gap-2">
              {currentUser.goals.map(goal => (
                <span
                  key={goal}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(198,241,53,0.1)',
                    border: '1px solid rgba(198,241,53,0.25)',
                    color: '#C6F135',
                  }}
                >
                  {goal}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Schedule */}
        <Card label="Availability">
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map(day => (
              <AvailabilityPill key={day} day={day} active={currentUser.availability.includes(day)} />
            ))}
          </div>
          {currentUser.timePreference.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {currentUser.timePreference.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    background: 'rgba(79,142,247,0.12)',
                    border: '1px solid rgba(79,142,247,0.3)',
                    color: '#4F8EF7',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Reliability */}
        <Card label="Trust Score">
          <ReliabilityBar score={currentUser.reliabilityScore} />
          <p className="text-xs mt-2" style={{ color: '#5A5A70' }}>
            Based on sessions completed and match responsiveness.
          </p>
        </Card>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-medium"
          style={{
            background: 'rgba(232,68,90,0.08)',
            border: '1px solid rgba(232,68,90,0.2)',
            color: '#E8445A',
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(18,18,26,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#5A5A70' }}>
        {label}
      </p>
      {children}
    </div>
  );
}
