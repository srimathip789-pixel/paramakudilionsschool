'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Bus, BookOpen, Laptop, Droplet, Trophy } from 'lucide-react';

export default function FacilitiesPage() {
  const facilities = [
    {
      title: 'Modern Infrastructure',
      description: 'The school features an architecturally impressive, spacious structure designed to meet all educational requirements. Fully air-conditioned classrooms create a comfortable, dust-free progressive learning environment for students.',
      icon: ShieldCheck,
      details: ['Spacious Classrooms', 'Air-Conditioned comfort', 'Ergonomic furniture', 'Well-ventilated spaces']
    },
    {
      title: 'Transport Services',
      description: 'Dedicated fleet of vehicles for transporting children safely to and from school and other school-connected co-curricular activities. We operate 20 vans/buses covering all major rural and urban routes surrounding Paramakudi.',
      icon: Bus,
      details: ['20 Vans & Buses', 'Experienced & licensed drivers', 'GPS tracking guidelines', 'Attendants in all vehicles']
    },
    {
      title: 'Rich Library',
      description: 'A sanctuary for learning. Our school library has a huge collection of more than 2,500 books. Students utilize library hours to cultivate reference skills, read current affairs, and develop a lifelong habit of reading.',
      icon: BookOpen,
      details: ['2,500+ Books', 'Academic journals & references', 'Daily newspapers & magazines', 'Dedicated reading periods']
    },
    {
      title: 'Computer & Language Lab',
      description: 'Technology is shaping the future. Our modern computer labs provide students with hands-on practice. We also feature a language lab to train children in correct pronunciation, accents, and fluent English speaking skills.',
      icon: Laptop,
      details: ['Modern computer units', 'High-speed local connection', 'Educational software tools', 'Language accent learning']
    },
    {
      title: 'RO Drinking Water',
      description: 'Student health is our highest priority. The school features an in-house Reverse Osmosis (RO) water purification plant to provide clean, safe, and cold drinking water throughout the campus, preventing water-borne issues.',
      icon: Droplet,
      details: ['RO Purification Plant', 'Regular water quality audits', 'Multiple water dispensaries', 'Hydration reminders']
    },
    {
      title: 'Spacious Outdoor Grounds',
      description: 'Physical training is key to holistic character development. We have large open playgrounds and specialized courts to host athletic coaching, sports matches, assemblies, and physical training drills.',
      icon: Trophy,
      details: ['Track and Field spaces', 'Kho-Kho & Volley Ball courts', 'Shuttle Badminton courts', 'Yoga & Karate spaces']
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Amenities & Infrastructure
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Our School Facilities
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Take a look at the state-of-the-art infrastructure designed to support a progressive and comfortable learning journey.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary-600/30 transition-all flex flex-col overflow-hidden group"
              >
                {/* Header visual */}
                <div className="h-3 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
                <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-black text-primary-900">{fac.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{fac.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2">Features</h4>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500">
                      {fac.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary-600"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Gallery Callout */}
      <section className="py-10 bg-slate-100 border-t border-slate-200/40 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <h3 className="font-heading font-black text-lg text-primary-900">Want to see these spaces in action?</h3>
          <p className="text-xs text-slate-500">We regularly update albums of student activities, science labs, and sports competitions.</p>
          <a href="/photogallery" className="bg-primary-900 hover:bg-primary-950 text-white font-bold text-xs py-3 px-6 rounded-full w-fit mx-auto shadow-md">
            View Photos
          </a>
        </div>
      </section>

    </div>
  );
}
