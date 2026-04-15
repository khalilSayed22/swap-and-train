import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, AlertCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { upsertProfile } from '../lib/database';

type Mode = 'login' | 'signup';

interface AuthScreenProps {
  mode: Mode;
}

export function AuthScreen({ mode: initialMode }: AuthScreenProps) {
  const { setActiveScreen, pendingOnboarding } = useApp();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    email.trim() &&
    password.length >= 6 &&
    (mode === 'login' || name.trim());

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError('');

    try {
      if (!isSupabaseConfigured) {
        // Demo mode — navigate straight to discover
        setActiveScreen('discover');
        return;
      }

      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (signUpError) throw signUpError;

        // Save onboarding data if collected before sign-up
        if (data.user && pendingOnboarding) {
          await upsertProfile(data.user.id, {
            name: name.trim(),
            sports: pendingOnboarding.sports,
            level: pendingOnboarding.level,
            goals: pendingOnboarding.goals,
            location: pendingOnboarding.location,
            onboarding_complete: true,
          });
        }
        // onAuthStateChange in AppContext will navigate to discover
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        // onAuthStateChange in AppContext handles the rest
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      setActiveScreen('discover');
      return;
    }
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      className="screen-no-nav flex flex-col px-6"
      style={{ background: '#0A0A0F', minHeight: '100vh' }}
    >
      {/* Back */}
      <button
        onClick={() => setActiveScreen('onboarding')}
        className="flex items-center gap-1.5 pt-14 pb-0 text-sm font-medium"
        style={{ color: '#5A5A70' }}
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="flex-1 flex flex-col justify-center pb-10">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-3xl font-black tracking-tight" style={{ color: '#F0F0F5' }}>
            Train<span style={{ color: '#C6F135' }}>Match</span>
          </span>
        </div>

        {/* Tab toggle */}
        <div
          className="flex rounded-xl p-1 mb-8"
          style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['login', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
              style={{
                background: mode === m ? 'rgba(198,241,53,0.12)' : 'transparent',
                color: mode === m ? '#C6F135' : '#5A5A70',
                border: mode === m ? '1px solid rgba(198,241,53,0.25)' : '1px solid transparent',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#5A5A70' }}>
                  Full Name
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#5A5A70' }}>
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#5A5A70' }}>
                Password
              </label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? '••••••••' : 'Min 6 characters'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#5A5A70' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-xl text-xs"
            style={{ background: 'rgba(232,68,90,0.1)', border: '1px solid rgba(232,68,90,0.25)', color: '#E8445A' }}
          >
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {mode === 'login' && (
          <button className="text-right text-xs mt-2 mb-0" style={{ color: '#5A5A70' }}>
            Forgot password?
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="mt-6 w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: isValid && !loading
              ? 'linear-gradient(135deg, #C6F135, #A8D020)'
              : 'rgba(198,241,53,0.15)',
            color: isValid && !loading ? '#0A0A0F' : '#5A5A70',
          }}
        >
          {loading && <Loader size={16} className="animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-xs" style={{ color: '#5A5A70' }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          className="w-full py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all duration-200"
          style={{
            background: 'rgba(26,26,38,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F0F0F5',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {mode === 'login' && (
          <p className="text-center text-sm mt-6" style={{ color: '#5A5A70' }}>
            New here?{' '}
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className="font-semibold"
              style={{ color: '#C6F135' }}
            >
              Create an account
            </button>
          </p>
        )}

        {!isSupabaseConfigured && (
          <p className="text-center text-xs mt-4 px-2 leading-relaxed" style={{ color: '#5A5A70' }}>
            Running in demo mode — add your Supabase credentials in{' '}
            <span style={{ color: '#C6F135' }}>.env.local</span> for real auth & persistence.
          </p>
        )}
      </div>
    </div>
  );
}
