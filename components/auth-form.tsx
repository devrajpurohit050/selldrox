"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { getSupabaseClient, isOAuthProviderEnabled } from '@/lib/supabase';

type AuthMode = 'login' | 'signup';

export function AuthForm({ mode, redirectPath = '/account' }: { mode: AuthMode; redirectPath?: string }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = typeof window !== 'undefined'
    ? new URL(redirectPath.startsWith('/') && !redirectPath.startsWith('//') ? redirectPath : '/account', window.location.origin).toString()
    : '/account';

  const handleProviderLogin = async (provider: 'google' | 'apple') => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Supabase is not connected yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your project settings, then restart the app.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const providerEnabled = await isOAuthProviderEnabled(provider);
      if (!providerEnabled) {
        const providerName = provider === 'google' ? 'Google' : 'Apple';
        setError(`${providerName} sign-in is not enabled in this Supabase project yet. Add the ${providerName} OAuth credentials under Authentication → Sign In / Providers, then try again.`);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (authError) {
        throw authError;
      }

      setSuccess('Redirecting to sign in…');
    } catch (providerError: unknown) {
      const message = providerError instanceof Error ? providerError.message : 'Unable to start social sign-in.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Supabase is not connected yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your project settings, then restart the app.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setSuccess('Account created. Check your email to confirm registration.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setSuccess('Signed in successfully. Redirecting…');
        window.location.href = redirectPath;
      }
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : 'Authentication failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(17,24,39,0.4)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        {isLogin ? 'Login' : 'Sign up'}
      </div>
      <h1 className="mt-4 text-3xl font-black text-white">{isLogin ? 'Welcome back' : 'Create your account'}</h1>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => handleProviderLogin('google')}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image src="/asstes/Google%20icon.jpg" alt="" width={20} height={20} className="h-5 w-5 rounded-full object-cover" />
          Continue with Google
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {!isLogin ? (
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400/60"
            placeholder="Full name"
            autoComplete="name"
          />
        ) : null}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400/60"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-400/60"
          placeholder="Password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
        />

        {error ? <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}
        {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{success}</div> : null}

        <button type="submit" disabled={loading} className="primary-btn w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70">
          {isLogin ? 'Login' : 'Create account'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-300">
        {isLogin ? 'Need an account?' : 'Already signed up?'}{' '}
        <Link
          href={`${isLogin ? '/signup' : '/login'}${redirectPath === '/account' ? '' : `?next=${encodeURIComponent(redirectPath)}`}`}
          className="text-blue-200 hover:text-blue-100"
        >
          {isLogin ? 'Sign up' : 'Login'}
        </Link>
      </div>
    </div>
  );
}
