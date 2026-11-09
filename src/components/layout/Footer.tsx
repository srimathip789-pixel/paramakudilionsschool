'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';
import { FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

interface ContactSettings {
  phone: string;
  mobile: string;
  email: string;
  address: string;
  facebook_url: string;
  youtube_url: string;
  instagram_url?: string;
  whatsapp_number?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '+91 - 4564- 228900',
    mobile: '+91 - 89031 14444',
    email: 'paramakudilions@yahoo.com',
    address: 'Paramakudi Lions Matriculation Higher secondary School, Thelichathanallur, Paramakudi - 623701, Ramanathapuram - Dist, Tamilnadu, India.',
    facebook_url: 'https://www.facebook.com/Lionsschoolpmk/',
    youtube_url: 'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA'
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      if (typeof supabase.from !== 'function') return;
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .single();
      if (data && !error) {
        setSettings(data);
      }
    }
    loadSettings();
  }, []);

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'History & About', href: '/aboutus' },
    { label: 'Our Teachers', href: '/staff' },
    { label: 'School Facilities', href: '/facilities' },
    { label: 'Extra Activities', href: '/activities' },
    { label: 'Sports & Games', href: '/sports' }
  ];

  const secondaryLinks = [
    { label: 'Photos', href: '/photogallery' },
    { label: 'Videos', href: '/videos' },
    { label: 'News & Announcements', href: '/events' },
    { label: 'Contact Us', href: '/contactus' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* School Intro */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-white font-extrabold text-lg uppercase tracking-tight">
              Paramakudi Lions
            </h3>
            <p className="text-xs text-secondary-600 font-bold tracking-wider uppercase">
              Matric. Hr. Sec. School
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incepted in 1991, Paramakudi Lions School has been a beacon of academic excellence, physical prowess, and moral values for over three decades in Ramanathapuram district.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a 
              href={settings.facebook_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300"
            >
              <FaFacebook size={16} />
            </a>
            <a 
              href={settings.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300"
            >
              <FaYoutube size={16} />
            </a>
            {settings.whatsapp_number && (
              <a 
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-300"
                title="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-l-2 border-primary-600 pl-2">
            Explore
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1 text-slate-400 font-medium">
                  <ArrowUpRight size={10} className="text-slate-600" /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources / More Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-l-2 border-primary-600 pl-2">
            Resources
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1 text-slate-400 font-medium">
                  <ArrowUpRight size={10} className="text-slate-600" /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-l-2 border-primary-600 pl-2">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-slate-400">
            <li className="flex gap-2">
              <MapPin size={16} className="text-secondary-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{settings.address}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={14} className="text-secondary-600 shrink-0" />
              <div>
                <a href={`tel:${settings.phone}`} className="hover:text-white block">Ph: {settings.phone}</a>
                <a href={`tel:${settings.mobile}`} className="hover:text-white block">Mob: {settings.mobile}</a>
              </div>
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={14} className="text-secondary-600 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white break-all">{settings.email}</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom copyright section */}
      <div className="border-t border-slate-800/80 bg-slate-950/45 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold">
          <p>© {new Date().getFullYear()} Paramakudi Lions Matriculation Higher Sec. School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
