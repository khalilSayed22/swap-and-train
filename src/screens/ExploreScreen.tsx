import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { FilterState, Level, Goal, Availability, TimePreference } from '../types';
import { ALL_SPORTS, ALL_GOALS, SPORT_CONFIG, LEVEL_CONFIG } from '../utils/sportConfig';

const DAYS: Availability[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES: TimePreference[] = ['Morning', 'Afternoon', 'Evening'];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const GENDERS = ['Anyone', 'Male', 'Female'] as const;

export function ExploreScreen() {
  const { filters, updateFilters } = useApp();
  const [local, setLocal] = useState<FilterState>({ ...filters });

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const apply = () => updateFilters(local);

  const reset = () => {
    const def: FilterState = {
      sports: [],
      maxDistance: 10,
      levels: [],
      goals: [],
      genderPreference: 'Anyone',
      availability: [],
      timePreference: [],
    };
    setLocal(def);
    updateFilters(def);
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F0F5' }}>Explore</h1>
          <p className="text-xs mt-0.5" style={{ color: '#5A5A70' }}>Refine your matches</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ color: '#5A5A70', background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div className="px-5 flex flex-col gap-6 pb-8">
        {/* Sports */}
        <Section label="Sports">
          <div className="grid grid-cols-3 gap-2">
            {ALL_SPORTS.map(sport => {
              const config = SPORT_CONFIG[sport];
              const active = local.sports.includes(sport);
              return (
                <button
                  key={sport}
                  onClick={() => setLocal(s => ({ ...s, sports: toggle(s.sports, sport) }))}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? config.bg : 'rgba(26,26,38,0.6)',
                    border: `1px solid ${active ? config.border : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span className="text-xl">{config.emoji}</span>
                  <span className="text-[10px] font-semibold" style={{ color: active ? config.color : '#5A5A70' }}>
                    {sport}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Distance */}
        <Section label={`Max Distance — ${local.maxDistance} km`}>
          <input
            type="range"
            min={1}
            max={25}
            value={local.maxDistance}
            onChange={e => setLocal(s => ({ ...s, maxDistance: Number(e.target.value) }))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C6F135 0%, #C6F135 ${(local.maxDistance / 25) * 100}%, rgba(255,255,255,0.1) ${(local.maxDistance / 25) * 100}%, rgba(255,255,255,0.1) 100%)`,
              accentColor: '#C6F135',
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: '#5A5A70' }}>1 km</span>
            <span className="text-[10px]" style={{ color: '#5A5A70' }}>25 km</span>
          </div>
        </Section>

        {/* Level */}
        <Section label="Experience Level">
          <div className="flex gap-2">
            {LEVELS.map(level => {
              const config = LEVEL_CONFIG[level];
              const active = local.levels.includes(level);
              return (
                <button
                  key={level}
                  onClick={() => setLocal(s => ({ ...s, levels: toggle(s.levels, level) }))}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
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
        </Section>

        {/* Goals */}
        <Section label="Goals">
          <div className="flex flex-wrap gap-2">
            {ALL_GOALS.map(goal => {
              const active = local.goals.includes(goal as Goal);
              return (
                <button
                  key={goal}
                  onClick={() => setLocal(s => ({ ...s, goals: toggle(s.goals, goal as Goal) }))}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
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
        </Section>

        {/* Availability */}
        <Section label="Availability">
          <div className="flex gap-1.5 flex-wrap">
            {DAYS.map(day => {
              const active = local.availability.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => setLocal(s => ({ ...s, availability: toggle(s.availability, day) }))}
                  className="w-10 h-10 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{
                    background: active ? 'rgba(198,241,53,0.12)' : 'rgba(26,26,38,0.6)',
                    border: `1px solid ${active ? 'rgba(198,241,53,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: active ? '#C6F135' : '#5A5A70',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Time */}
        <Section label="Time Preference">
          <div className="flex gap-2">
            {TIMES.map(time => {
              const active = local.timePreference.includes(time);
              const icons: Record<TimePreference, string> = { Morning: '🌅', Afternoon: '☀️', Evening: '🌙' };
              return (
                <button
                  key={time}
                  onClick={() => setLocal(s => ({ ...s, timePreference: toggle(s.timePreference, time) }))}
                  className="flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all duration-200"
                  style={{
                    background: active ? 'rgba(198,241,53,0.12)' : 'rgba(26,26,38,0.6)',
                    border: `1px solid ${active ? 'rgba(198,241,53,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span>{icons[time]}</span>
                  <span className="text-[10px] font-semibold" style={{ color: active ? '#C6F135' : '#5A5A70' }}>
                    {time}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Gender */}
        <Section label="Preferred Partner">
          <div className="flex gap-2">
            {GENDERS.map(g => {
              const active = local.genderPreference === g;
              return (
                <button
                  key={g}
                  onClick={() => setLocal(s => ({ ...s, genderPreference: g }))}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    background: active ? 'rgba(198,241,53,0.12)' : 'rgba(26,26,38,0.6)',
                    border: `1px solid ${active ? 'rgba(198,241,53,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: active ? '#C6F135' : '#5A5A70',
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Apply */}
        <button
          onClick={apply}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base"
          style={{ background: 'linear-gradient(135deg, #C6F135, #A8D020)', color: '#0A0A0F' }}
        >
          <Check size={18} strokeWidth={2.5} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#5A5A70' }}>
        {label}
      </p>
      {children}
    </div>
  );
}
