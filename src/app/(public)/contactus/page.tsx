'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Phone, Mail, MapPin, Clock, Send, ShieldAlert } from 'lucide-react';
import { FaFacebook, FaYoutube } from 'react-icons/fa';

interface ContactSettings {
  phone: string;
  mobile: string;
  email: string;
  address: string;
  google_maps_embed?: string;
  office_hours: string;
  facebook_url: string;
  youtube_url: string;
  instagram_url?: string;
  whatsapp_number?: string;
}

export default function ContactUsPage() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '+91 - 4564- 228900',
    mobile: '+91 - 89031 14444',
    email: 'paramakudilions@yahoo.com',
    address: 'Paramakudi Lions Matriculation Higher secondary School, Thelichathanallur, Paramakudi - 623701, Ramanathapuram - Dist, Tamilnadu, India.',
    google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.31135439775!2d78.583908!3d9.544605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01511d5ffffff%3A0xc0fb1309f7a77d85!2sParamakudi%20Lions%20Matriculation%20Higher%20Secondary%20School!5e0!3m2!1sen!2sin!4v1700000000000',
    office_hours: 'Mon - Sat: 9:00 AM - 4:30 PM',
    facebook_url: 'https://www.facebook.com/Lionsschoolpmk/',
    youtube_url: 'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA'
  });

  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      if (typeof supabase.from !== 'function') {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('*')
          .single();

        if (data && !error) {
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const contactCards = [
    {
      title: 'Our Location',
      info: settings.address,
      icon: MapPin,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Contact Numbers',
      info: `Mobile: ${settings.mobile}\nPhone: ${settings.phone}`,
      icon: Phone,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Email Address',
      info: settings.email,
      icon: Mail,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Office Hours',
      info: settings.office_hours,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Admissions & Help Desk
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Contact Us
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Get in touch with our administrative office for fee inquiries, syllabus requests, and application form assistance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-heading text-sm font-black text-primary-900">{card.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line font-semibold">
                  {card.info}
                </p>
              </div>
            );
          })}
        </div>

        {/* Map and Social Links */}
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-4 text-center">
            <h3 className="font-heading text-2xl font-extrabold text-primary-900 border-b border-slate-100 pb-2">
              Google Maps Location
            </h3>
          </div>
          
          <div className="w-full h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-md relative bg-slate-150">
            {settings.google_maps_embed ? (
              <iframe 
                src={settings.google_maps_embed}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <ShieldAlert size={28} />
                <span className="text-[10px] font-bold uppercase mt-2">Map Embed Not Configured</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 mt-4">
            <h4 className="font-bold text-slate-800 text-sm">Follow Social Channels</h4>
            <div className="flex items-center gap-3">
              <a 
                href={settings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-100 hover:bg-[#1877F2] hover:text-white text-slate-700 px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm border border-slate-200/50"
              >
                <FaFacebook size={16} /> Facebook
              </a>
              <a 
                href={settings.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-100 hover:bg-[#FF0000] hover:text-white text-slate-700 px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm border border-slate-200/50"
              >
                <FaYoutube size={16} /> YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
