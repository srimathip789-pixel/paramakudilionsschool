'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trophy, ShieldAlert, Award, Star, Compass } from 'lucide-react';

interface Achievement {
  id: string;
  student_name: string;
  competition: string;
  achievement: string;
  photo_url?: string;
  certificate_url?: string;
}

export default function SportsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadAchievements() {
      if (typeof supabase.from !== 'function') {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error) {
          setAchievements(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  const boysTeams = [
    'KHO-KHO', 'Ball Badminton', 'Volley Ball', 'Hand Ball', 
    'Throw Ball', 'Badminton (Single & Double)', 'Basket Ball', 
    'Tennikoit (Single & Double)', 'Carrom (Single & Double)', 
    'Beach Volley Ball', 'Silambam', 'Athletics', 'Chess'
  ];

  const girlsTeams = [
    'KHO-KHO', 'Ball Badminton', 'Volley Ball', 'Throw Ball', 
    'Badminton (Single & Double)', 'Basket Ball', 'Tennikoit (Single & Double)', 
    'Carrom (Single & Double)', 'Table Tennis', 'Silambam', 'Athletics', 'Chess'
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Athletic Excellence
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Sports & Games
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Nurturing discipline, team spirit, and physical health through competitive tournaments and coaching.
          </p>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-900">
            Our Sports Teams
          </h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            We field highly competitive teams at district, zonal, and state-level tournaments for both boys and girls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Boys Teams */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
            <h4 className="font-heading font-black text-lg text-primary-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Boys Sports Teams
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
              {boysTeams.map((team, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                  <span>{team}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Girls Teams */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
            <h4 className="font-heading font-black text-lg text-primary-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              Girls Sports Teams
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
              {girlsTeams.map((team, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                  <span>{team}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Achievements Section */}
      <section className="bg-slate-100/60 py-16 px-4 md:px-8 border-t border-slate-200/40">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-widest flex items-center gap-1 justify-center">
              <Trophy size={14} className="text-accent-500 fill-accent-500" /> Wall of Fame
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-900">
              Recent Achievements
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Celebrating our students' outstanding victories and participation certificates in regional and state-wide competitions.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-400 font-bold">Loading Achievements...</span>
            </div>
          ) : achievements.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm text-center max-w-lg mx-auto flex flex-col items-center gap-3">
              <Award size={40} className="text-slate-300" />
              <h4 className="font-bold text-primary-900 text-sm">Zonal & State Champions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lions School students regularly participate in State Board sports divisions, Silambam tournaments, and chess meets. Specific accolades will be uploaded shortly by the school administrator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-48 relative bg-slate-100 flex items-center justify-center text-slate-300">
                    {ach.photo_url ? (
                      <img src={ach.photo_url} alt={ach.student_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Trophy size={36} className="text-slate-300" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Award Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <h4 className="font-extrabold text-primary-900 text-sm">{ach.student_name}</h4>
                    <span className="text-[10px] bg-accent-50 text-accent-700 border border-accent-600/20 px-2 py-0.5 rounded w-fit font-bold uppercase">
                      {ach.achievement}
                    </span>
                    <p className="text-slate-500 text-xs font-semibold leading-snug mt-1">{ach.competition}</p>
                    {ach.certificate_url && (
                      <a 
                        href={ach.certificate_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] text-primary-700 hover:text-primary-800 font-bold border-t border-slate-100 pt-3 mt-auto block"
                      >
                        View Merit Certificate &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
