import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import type { Sport, Level, Goal } from '../types';
import { ALL_SPORTS, ALL_GOALS, SPORT_CONFIG, LEVEL_CONFIG } from '../utils/sportConfig';
import { useApp } from '../context/AppContext';

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const LOCATIONS = ['Hackney', 'Shoreditch', 'Brixton', 'Camden', 'Clapham', 'Stratford', 'Islington'];

export function OnboardingScreen() {
  const { setActiveScreen, setPendingOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const totalSteps = 4;

  const toggleSport = (sport: Sport) =>
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport],
    );

  const toggleGoal = (goal: Goal) =>
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );

  const canNext = () => {
    if (step === 1) return selectedSports.length > 0;
    if (step === 2) return selectedLevel !== null && selectedGoals.length > 0;
    if (step === 3) return selectedLocation !== '';
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      // Store onboarding data in context so AuthScreen can save it on sign-up
      setPendingOnboarding({
        sports: selectedSports,
        level: selectedLevel ?? 'Beginner',
        goals: selectedGoals,
        location: selectedLocation ? `${selectedLocation}, London` : '',
      });
      setActiveScreen('auth-signup');
    }
  };

  return (
    <div className="screen-no-nav flex flex-col" style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      {/* Progress bar */}
      {step > 0 && (
        <div className="px-6 pt-14 pb-0">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => (
              <div
                key={i}
                className="h-0.5 flex-1 rounded-full transition-all duration-500"
                style={{ background: i < step ? '#C6F135' : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="flex-1 flex flex-col px-6"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center pb-10">
              <motion.div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 text-5xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(198,241,53,0.15), rgba(198,241,53,0.05))',
                  border: '1px solid rgba(198,241,53,0.25)',
                  boxShadow: '0 0 60px rgba(198,241,53,0.15)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⚡
              </motion.div>
              <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: '#F0F0F5' }}>
                Train<span style={{ color: '#C6F135' }}>Match</span>
              </h1>
              <p className="text-base leading-relaxed mb-2" style={{ color: '#A0A0B0' }}>
                Find your perfect workout partner.
              </p>
              <p className="text-sm" style={{ color: '#5A5A70' }}>
                Real athletes. Real accountability. Zero excuses.
              </p>

              <div className="mt-10 flex flex-col gap-3 w-full">
                {[
                  { icon: '🎯', text: 'Match by sport, level & schedule' },
                  { icon: '📍', text: 'Find partners near you' },
                  { icon: '💬', text: 'Plan sessions together' },
                ].map(item => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                    style={{ background: 'rgba(26,26,38,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#A0A0B0' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Sport Select */}
          {step === 1 && (
            <div className="pt-8 pb-6">
              <h2 className="text-2xl font-black mb-1" style={{ color: '#F0F0F5' }}>
                What do you train?
              </h2>
              <p className="text-sm mb-6" style={{ color: '#5A5A70' }}>
                Pick all that apply — we'll find partners for each.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {ALL_SPORTS.map(sport => {
                  const config = SPORT_CONFIG[sport];
                  const active = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      onClick={() => toggleSport(sport)}
                      className="flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all duration-200 active:scale-95"
                      style={{
                        background: active ? config.bg : 'rgba(26,26,38,0.6)',
                        border: `1px solid ${active ? config.border : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <span className="text-2xl">{config.emoji}</span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: active ? config.color : '#5A5A70' }}
                      >
                        {sport}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Level + Goals */}
          {step === 2 && (
            <div className="pt-8 pb-6">
              <h2 className="text-2xl font-black mb-1" style={{ color: '#F0F0F5' }}>
                Your level & goals
              </h2>
              <p className="text-sm mb-5" style={{ color: '#5A5A70' }}>
                Honest answers get you better matches.
              </p>

              <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#5A5A70' }}>
                Experience Level
              </p>
              <div className="flex gap-2 mb-6">
                {LEVELS.map(level => {
                  const config = LEVEL_CONFIG[level];
                  const active = selectedLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{
                        background: active ? config.bg : 'rgba(26,26,38,0.6)',
                        border: `1px solid ${active ? config.border : 'rgba(255,255,255,0.06)'}`,
                        color: active ? config.color : '#5A5A70',
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#5A5A70' }}>
                Goals (pick all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_GOALS.map(goal => {
                  const active = selectedGoals.includes(goal as Goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal as Goal)}
                      className="px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                      style={{
                        background: active ? 'rgba(198,241,53,0.12)' : 'rgba(26,26,38,0.6)',
                        border: `1px solid ${active ? 'rgba(198,241,53,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        color: active ? '#C6F135' : '#5A5A70',
                      }}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="pt-8 pb-6">
              <h2 className="text-2xl font-black mb-1" style={{ color: '#F0F0F5' }}>
                Where are you based?
              </h2>
              <p className="text-sm mb-6" style={{ color: '#5A5A70' }}>
                We'll prioritise partners in your area.
              </p>

              <div className="flex flex-col gap-2">
                {LOCATIONS.map(loc => {
                  const active = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: active ? 'rgba(198,241,53,0.08)' : 'rgba(26,26,38,0.6)',
                        border: `1px solid ${active ? 'rgba(198,241,53,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <MapPin size={16} style={{ color: active ? '#C6F135' : '#5A5A70' }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: active ? '#C6F135' : '#A0A0B0' }}
                      >
                        {loc}, London
                      </span>
                      {active && (
                        <div
                          className="ml-auto w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: '#C6F135' }}
                        >
                          <span style={{ fontSize: 9, color: '#0A0A0F', fontWeight: 900 }}>✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="px-6 pb-10 pt-4 flex flex-col gap-3">
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200"
          style={{
            background: canNext()
              ? 'linear-gradient(135deg, #C6F135, #A8D020)'
              : 'rgba(198,241,53,0.2)',
            color: canNext() ? '#0A0A0F' : '#5A5A70',
          }}
        >
          {step === totalSteps - 1 ? 'Get Started' : 'Continue'}
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center justify-center gap-1.5 text-sm font-medium py-2"
            style={{ color: '#5A5A70' }}
          >
            <ChevronLeft size={15} />
            Back
          </button>
        )}

        {step === 0 && (
          <button
            onClick={() => setActiveScreen('auth-login')}
            className="text-sm font-medium py-2 text-center"
            style={{ color: '#5A5A70' }}
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
