'use client';

import React from 'react';
import Image from 'next/image';
import { Landmark, Award, BookOpen, Compass, Shield, Users, Heart } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            History & Milestones
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            About Lions School
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Discover the legacy, values, and academic framework that guide our institution.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* History */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 flex flex-col gap-4">
            <h3 className="font-heading text-2xl font-black text-primary-900 flex items-center gap-2">
              <Landmark className="text-primary-600" size={24} />
              Our Legacy and History
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              In 1991, a small seed was planted in Paramakudi Lions soil and that has grown into a sturdy tree. 
              The members of Paramakudi Lions Club, quietly spearhead a new educational awakening among the young students of India. 
              They took it as a challenge, encouraging many parents to send their children to school.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Excellence in who we are and what we do rests on the foundation of a deep self-awareness and an elevated attitude. 
              It is not simply about academic grades but developing an elevated personality whose presence is able to inspire many others towards a truthful and righteous way of life. 
              Our Lionites successfully bring about the best in themselves, following our founders who always inspired us to do more.
            </p>
          </div>
          <div className="md:col-span-4 bg-primary-900/5 p-6 rounded-2xl border border-primary-900/5">
            <h4 className="font-bold text-primary-900 text-sm mb-3">Key Milestones</h4>
            <ul className="flex flex-col gap-3 text-xs text-slate-600">
              <li className="flex gap-2">
                <span className="font-black text-primary-700">1991</span>
                <span>Established with a minimal strength of students.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-primary-700">2016</span>
                <span>Celebrated Silver Jubilee (25 years of educational service).</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-primary-700">Present</span>
                <span>A sturdy tree educating hundreds of students with modern digital blocks.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vision */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
              <Compass size={20} />
            </div>
            <h4 className="font-bold text-primary-900 text-base">Our Vision</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              To spearhead educational awakening, building students as powerful instruments of truth, right living, and service for the greater glory of God.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h4 className="font-bold text-primary-900 text-base">Our Mission</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              To provide child-centric training through sensory development, remove academic burdens, and teach social values under Tender, Love, and Care.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h4 className="font-bold text-primary-900 text-base">Core Values</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              We focus on cultivating integrity, humanitarian service (guided by the Lions Club values), physical discipline, and respect for our culture.
            </p>
          </div>
        </div>

        {/* Kindergarten Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-100/50 p-6 md:p-8 rounded-3xl border border-slate-200/50">
          <div className="md:col-span-4 relative h-60 w-full rounded-2xl overflow-hidden shadow-md bg-slate-200">
            <Image src="/images/gallery5.jpg" alt="Kindergarten block" fill className="object-cover" />
          </div>
          <div className="md:col-span-8 flex flex-col gap-4">
            <span className="text-[10px] text-accent-700 font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Heart size={12} className="text-red-500 fill-red-500" /> Kinder Garten Block
            </span>
            <h3 className="font-heading text-xl md:text-2xl font-black text-primary-900">
              "An educated child is the treasure of a home"
            </h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              To obtain this treasure, the latest trends and modern education are harmoniously blended in our KG Block. 
              Holistic education is imparted to the tiny tots through the training of senses. 
              The burden of homework is avoided and the kids feel free. They are not taught, but are trained to be taught. 
              Here, teachers take the place of parents, and the medium followed is **"Tender, Love, and Care"**.
            </p>
          </div>
        </div>

        {/* Scheme of Studies & Honours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Studies */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-150/70 flex flex-col gap-4">
            <h4 className="font-bold text-primary-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen size={18} className="text-primary-600" /> Scheme of Studies
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              The scheme of studies, scheme of examinations, and the course of studies prescribed by the **Government of Tamil Nadu** are strictly followed.
            </p>
            <ul className="text-xs text-slate-500 flex flex-col gap-2 font-medium list-disc pl-4">
              <li>Medium of instruction is English for all classes.</li>
              <li>Continuous assessments in practical work, Art & Craft.</li>
              <li>Grades awarded for Physical Education, Yoga, and Health.</li>
            </ul>
          </div>

          {/* Honours */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-150/70 flex flex-col gap-4">
            <h4 className="font-bold text-primary-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award size={18} className="text-primary-600" /> Honours & Awards
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              At the end of every academic year, pupils are honored for excellence in various fields to foster motivation:
            </p>
            <ul className="text-xs text-slate-500 flex flex-col gap-2 font-medium list-disc pl-4">
              <li>**100% Attendance**: Certificates for regular attendance.</li>
              <li>**Proficiency Winners**: Rewards for academic toppers.</li>
              <li>**Sports Accolades**: Medals for athletic achievements.</li>
              <li>**Best Teacher Award**: Annual recognition of teaching dedication.</li>
            </ul>
          </div>

        </div>

      </section>

    </div>
  );
}
