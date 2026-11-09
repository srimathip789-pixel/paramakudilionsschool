'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Megaphone, Calendar, Image as ImageIcon, Video, 
  Users, Award, Download, ArrowUpRight, ShieldCheck, 
  ShieldAlert, Settings, FileCode2
} from 'lucide-react';

interface Stats {
  notices: number;
  news: number;
  events: number;
  staff: number;
  members: number;
  photos: number;
  videos: number;
  achievements: number;
  downloads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    notices: 0,
    news: 0,
    events: 0,
    staff: 0,
    members: 0,
    photos: 0,
    videos: 0,
    achievements: 0,
    downloads: 0
  });

  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      if (typeof supabase.from !== 'function') {
        setDbConfigured(false);
        setLoading(false);
        return;
      }

      try {
        // Query counts for tables
        const queries = [
          supabase.from('notices').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('staff').select('id', { count: 'exact', head: true }),
          supabase.from('committee_members').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('achievements').select('id', { count: 'exact', head: true }),
          supabase.from('downloads').select('id', { count: 'exact', head: true })
        ];

        const results = await Promise.all(queries);

        // Check if queries failed because tables don't exist
        const hasTableError = results.some(res => res.error && res.error.code === 'P0001');
        const hasNulls = results.some(res => res.error && res.error.message.includes('relation'));

        if (hasTableError || hasNulls) {
          setDbConfigured(false);
        } else {
          setStats({
            notices: results[0].count || 0,
            news: results[1].count || 0,
            events: results[2].count || 0,
            staff: results[3].count || 0,
            members: results[4].count || 0,
            photos: results[5].count || 0,
            videos: results[6].count || 0,
            achievements: results[7].count || 0,
            downloads: results[8].count || 0
          });
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statsConfig = [
    { label: 'Notices Board', count: stats.notices, href: '/admin/notices', icon: Megaphone, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'News Articles', count: stats.news, href: '/admin/news', icon: Megaphone, color: 'bg-green-500/10 text-green-600' },
    { label: 'Upcoming Events', count: stats.events, href: '/admin/events', icon: Calendar, color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Staff / Teachers', count: stats.staff, href: '/admin/staff', icon: Users, color: 'bg-indigo-500/10 text-indigo-600' },
    { label: 'Committee Members', count: stats.members, href: '/admin/members', icon: Users, color: 'bg-sky-500/10 text-sky-600' },
    { label: 'Photos', count: stats.photos, href: '/admin/gallery', icon: ImageIcon, color: 'bg-rose-500/10 text-rose-600' },
    { label: 'Videos Uploaded', count: stats.videos, href: '/admin/videos', icon: Video, color: 'bg-teal-500/10 text-teal-600' },
    { label: 'Student Achievements', count: stats.achievements, href: '/admin/achievements', icon: Award, color: 'bg-amber-500/10 text-amber-600' }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-secondary-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col gap-2">
        <h1 className="font-heading font-black text-xl md:text-3xl leading-none">Welcome back to School Admin Portal</h1>
        <p className="text-xs md:text-sm text-slate-200 font-medium">Restructure pages, upload photos, adjust timetables, and add committee members dynamically.</p>
      </div>

      {/* Database Warning */}
      {!dbConfigured && (
        <div className="bg-amber-50 border border-amber-250 p-5 rounded-3xl flex flex-col md:flex-row items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <h3 className="font-bold text-amber-900 text-sm">Database Setup Required</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              We couldn't connect to the database tables or some tables are missing. Please ensure your Supabase project is active, environment variables are set in `.env.local`, and you have executed the setup commands in the **supabase-schema.sql** file.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link 
                href="/supabase-schema.sql" 
                target="_blank" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <FileCode2 size={14} /> Open schema.sql file
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Database Resource Counts</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 font-bold">Querying Supabase database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsConfig.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Link 
                  key={idx} 
                  href={stat.href}
                  className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-primary-900 text-sm group-hover:text-primary-750 transition-colors">
                        {stat.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-extrabold mt-0.5">Manage Items</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-slate-800">{stat.count}</span>
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
