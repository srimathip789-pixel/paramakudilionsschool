'use client';

import React from 'react';
import { Users, Compass, Leaf, ShoppingCart, Calculator, Sparkles, Music, Target } from 'lucide-react';

export default function ActivitiesPage() {
  const clubs = [
    {
      title: 'Scout',
      description: 'Developing character, citizenship, and personal fitness through outdoor activities and leadership training.',
      icon: Compass,
      badge: 'Character Building'
    },
    {
      title: 'Leo Club',
      description: 'Sponsored by the Lions Club, the Leo Club encourages youth to develop leadership qualities and administrative skills by initiating and executing social service activities.',
      icon: Users,
      badge: 'Leadership Development'
    },
    {
      title: 'NGC (National Green Crops)',
      description: 'Promoting environmental awareness, ecological conservation, and sustainable practices among students.',
      icon: Leaf,
      badge: 'Environment'
    },
    {
      title: 'Consumer Club',
      description: 'Educating students about consumer rights, responsibilities, and ethical practices in society.',
      icon: ShoppingCart,
      badge: 'Awareness'
    }
  ];

  const subActivities = [
    {
      title: 'Abacus',
      description: 'Enhancing mathematical abilities, mental arithmetic, and cognitive development through specialized abacus training.',
      icon: Calculator
    },
    {
      title: 'Bharatham',
      description: 'Preserving cultural heritage through the classical Indian dance form of Bharatanatyam, focusing on expression and rhythm.',
      icon: Sparkles
    },
    {
      title: 'Western Dance',
      description: 'Energetic and modern dance styles to improve flexibility, coordination, and physical fitness.',
      icon: Music
    },
    {
      title: 'Archery',
      description: 'Developing focus, precision, and discipline through professional archery practice.',
      icon: Target
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Co-Curricular & Clubs
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Student Activities
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Empowering students beyond the classroom through leadership, social service, and specialized physical skills.
          </p>
        </div>
      </section>

      {/* Clubs & Voluntary Organizations */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-10">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-heading text-2xl font-black text-primary-900">
            Voluntary Clubs & Organizations
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Nurturing civic sense and humanitarian leadership</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {clubs.map((club, idx) => {
            const Icon = club.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary-600/30 transition-all flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-primary-900/5 rounded-full"></div>
                <span className="text-[10px] bg-primary-100 text-primary-700 font-extrabold px-2 py-0.5 rounded-full w-fit uppercase">
                  {club.badge}
                </span>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-heading text-lg font-black text-primary-900">{club.title}</h4>
                </div>
                
                <p className="text-slate-600 text-xs leading-relaxed flex-grow">{club.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Special Coaching Programs */}
      <section className="bg-slate-100/60 py-16 px-4 md:px-8 border-t border-slate-200/40">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-heading text-2xl font-black text-primary-900">
              Specialized Training Programs
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Cultivating balance, defense, and creative skills</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-755 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-secondary-600" />
                  </div>
                  <h4 className="font-bold text-primary-900 text-sm">{act.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{act.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
