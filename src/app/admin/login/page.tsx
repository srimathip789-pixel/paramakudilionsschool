'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { KeyRound, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (typeof supabase.auth?.signInWithPassword !== 'function') {
      setError('Supabase is not configured yet. Please set your environment variables.');
      setLoading(false);
      return;
    }

    try {
      // Map username to Supabase Auth email format
      let loginEmail = username.trim();
      if (loginEmail === 'lionadmin') {
        loginEmail = 'lionadmin@test.com'; // Option A mapping
      } else if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail}@lionsschool.in`;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-700/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-colors mb-6">
          <ArrowLeft size={14} /> Back to School Website
        </Link>
        
        {/* Logo and title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-600 bg-white relative flex items-center justify-center">
            <Image src="/images/logo.jpg" alt="Lions School Logo" fill className="object-cover" />
          </div>
          <div className="text-center">
            <h2 className="font-heading text-2xl font-black text-white tracking-tight uppercase">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wider mt-0.5">
              Paramakudi Lions Matric. School
            </p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-4 shadow-xl border border-slate-700/50 rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className="bg-red-500/15 border border-red-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent font-semibold"
                  placeholder="lionadmin"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 border-t border-slate-700/60 pt-4 text-center">
            <span className="text-[10px] text-slate-500 font-semibold leading-relaxed block">
              The first user can be seeded inside the Supabase Auth -&gt; Users dashboard.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
