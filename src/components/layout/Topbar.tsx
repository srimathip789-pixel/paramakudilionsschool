'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, Camera, ExternalLink } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

interface ContactSettings {
  phone: string;
  mobile: string;
  email: string;
  facebook_url: string;
  youtube_url: string;
  instagram_url?: string;
  whatsapp_number?: string;
}

export default function Topbar() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '+91 - 4564- 228900',
    mobile: '+91 - 89031 14444',
    email: 'paramakudilions@yahoo.com',
    facebook_url: 'https://www.facebook.com/Lionsschoolpmk/',
    youtube_url: 'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA'
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      if (typeof supabase.from !== 'function') return;
      const { data, error } = await supabase.from('contact_settings').select('*').single();
      if (data && !error) setSettings(data);
    }
    loadSettings();
  }, [supabase]);

  return (
    <div
      className="text-white text-[11px] py-1.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-1.5 w-full z-50 relative"
      style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 60%, #0369a1 100%)' }}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <a href={`https://wa.me/919345634443`} className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors font-medium">
          <FaWhatsapp size={14} />
          <span>+91 9345634443</span>
        </a>
        <span className="hidden sm:inline text-white/30">|</span>
        <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors font-medium">
          <Mail size={14} />
          <span>{settings.email}</span>
        </a>
      </div>
      <div className="flex items-center gap-3">
        <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
          className="text-blue-600 hover:text-white hover:bg-blue-600 transition-colors flex items-center justify-center bg-blue-100 rounded-full w-7 h-7 sm:w-8 sm:h-8" title="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" 
          className="text-red-600 hover:text-white hover:bg-red-600 transition-colors flex items-center justify-center bg-red-100 rounded-full w-7 h-7 sm:w-8 sm:h-8" title="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
        </a>
        {settings.instagram_url && (
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors" title="Instagram">
            <Camera size={13} />
          </a>
        )}

      </div>
    </div>
  );
}
