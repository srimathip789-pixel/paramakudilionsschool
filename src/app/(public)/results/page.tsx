'use client';

import React from 'react';
import { Award, Trophy, Users, BookOpen, Star } from 'lucide-react';

export default function ResultsPage() {
  const statistics = [
    { label: 'HSC (Class XII) Pass Rate', value: '100%' },
    { label: 'SSLC (Class X) Pass Rate', value: '100%' },
    { label: 'District Rank Holders', value: '03' }
  ];

  const highlights = [
    {
      subject: 'Physics & Chemistry',
      topper: 'M. Sivaranjini',
      score: '100/100 Centum',
      detail: 'Highest mark achieved in District Board Examinations.'
    },
    {
      subject: 'Mathematics',
      topper: 'K. Ramkumar',
      score: '100/100 Centum',
      detail: 'Centum achieved in State-level Board Examination.'
    },
    {
      subject: 'Computer Science',
      topper: 'S. Mahendran',
      score: '99/100',
      detail: 'Exceptional programming marks in HSC final assessment.'
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Academic Performance
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Board Examination Results
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Celebrating our students' outstanding performance in Tamil Nadu State Board Examinations year-on-year.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-750 flex items-center justify-center mb-1">
                <Trophy className="text-primary-700" size={24} />
              </div>
              <span className="text-3xl font-black text-primary-700 leading-none">{stat.value}</span>
              <span className="text-xs text-slate-500 font-extrabold uppercase mt-1 leading-snug">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-heading text-xl md:text-2xl font-black text-primary-900">
              Board Examination Subject Toppers
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Exceptional scoring records of our senior students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden">
                <span className="absolute top-4 right-4 text-accent-500">
                  <Star size={16} className="fill-accent-500" />
                </span>
                
                <span className="text-[10px] text-primary-750 bg-primary-50 px-2 py-0.5 rounded w-fit font-bold uppercase">
                  {item.subject}
                </span>
                
                <div>
                  <h4 className="font-extrabold text-primary-900 text-sm">{item.topper}</h4>
                  <span className="text-xs text-secondary-700 font-bold mt-1 block">{item.score}</span>
                </div>
                
                <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3 mt-1 font-medium">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Note block */}
        <div className="bg-primary-900/5 p-6 md:p-8 rounded-3xl border border-primary-900/10 text-center flex flex-col gap-2 max-w-2xl mx-auto">
          <BookOpen className="text-primary-700 mx-auto" size={28} />
          <h4 className="font-bold text-primary-900 text-sm mt-1">Official Results Portals</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Students can verify their official mark sheets online. When Tamil Nadu board results are announced, links will be updated here. Alternatively, visit the official board results site:
          </p>
          <a 
            href="https://tnresults.nic.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-black text-primary-700 hover:text-primary-800 hover:underline mt-2 inline-flex items-center justify-center gap-1"
          >
            Visit TN Results Portal (tnresults.nic.in) &rarr;
          </a>
        </div>

      </section>

    </div>
  );
}
