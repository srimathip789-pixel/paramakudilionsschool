'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Menu, X, ChevronDown, Phone, Mail, Play, Share2,
  Camera, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '+91 - 4564- 228900',
    mobile: '+91 - 89031 14444',
    email: 'paramakudilions@yahoo.com',
    facebook_url: 'https://www.facebook.com/Lionsschoolpmk/',
    youtube_url: 'https://www.youtube.com/channel/UCsUpLU-nTY_0iC59z8IvvPA'
  });

  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSettings() {
      if (typeof supabase.from !== 'function') return;
      const { data, error } = await supabase.from('contact_settings').select('*').single();
      if (data && !error) setSettings(data);
    }
    loadSettings();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      key: 'about',
      submenu: [
        { label: 'History', href: '/aboutus' }
      ]
    },
    { label: 'Members', href: '/members' },
    { label: 'Staff', href: '/staff' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Activities', href: '/activities' },
    { label: 'Sports & Games', href: '/sports' },
    { label: 'Photos', href: '/photogallery' },
    { label: 'Videos', href: '/videos' },
    { label: 'News & Events', href: '/events' },
    { label: 'Contact Us', href: '/contactus' }
  ];

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };

  return (
    <header className="w-full z-50 sticky top-0">


      {/* ── Main Navigation Bar ── */}
      <div
        className={cn(
          'w-full transition-all duration-300',
          scrolled
            ? 'bg-white/98 shadow-lg shadow-blue-900/10 border-b border-blue-100'
            : 'bg-white border-b border-slate-100 shadow-sm'
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">

          {/* Desktop Nav */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center flex-1 justify-center">
            <div className="flex items-center flex-wrap justify-end gap-0">
              {navLinks.map((link) => {
                if (link.submenu) {
                  const isSubmenuActive = link.submenu.some(s => pathname === s.href);
                  const isDropOpen = activeDropdown === link.key;
                  return (
                    <div key={link.key} className="relative">
                      <button
                        onClick={() => toggleDropdown(link.key!)}
                        className={cn(
                          'flex items-center gap-0.5 px-2.5 py-2 text-[12.5px] font-semibold rounded transition-all cursor-pointer whitespace-nowrap',
                          isSubmenuActive || isDropOpen
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/60'
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          size={13}
                          className={cn('transition-transform duration-200 mt-0.5', isDropOpen && 'rotate-180')}
                        />
                      </button>
                      {/* Dropdown */}
                      {isDropOpen && (
                        <div className="absolute left-0 top-full mt-1 w-52 rounded-xl bg-white shadow-xl border border-blue-50 z-50 py-1.5 overflow-hidden">
                          <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-yellow-500 mb-1" />
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                'block px-4 py-2 text-[12px] font-semibold transition-colors hover:bg-blue-50 hover:text-blue-700',
                                pathname === sub.href ? 'text-blue-700 bg-blue-50' : 'text-slate-600'
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={cn(
                      'px-2.5 py-2 text-[12.5px] font-semibold rounded transition-all whitespace-nowrap',
                      isActive
                        ? 'text-blue-700 bg-blue-50 font-bold'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/60'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Active page indicator bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-700 via-yellow-500 to-blue-700 opacity-70" />
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={cn(
            'fixed right-0 top-0 bottom-0 w-80 max-w-[88vw] bg-white shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div
            className="flex justify-between items-center px-5 py-4"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 relative">
                <Image src="/images/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm uppercase">Paramakudi <span className="text-yellow-400">Lions</span></p>
                <p className="text-[10px] text-blue-200 font-semibold">Matric. Hr. Sec. School</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex flex-col gap-0.5 flex-1 px-4 py-4">
            {navLinks.map((link) => {
              if (link.submenu) {
                const isSubmenuActive = link.submenu.some(s => pathname === s.href);
                const isDropOpen = activeDropdown === link.key;
                return (
                  <div key={link.key} className="flex flex-col">
                    <button
                      onClick={() => toggleDropdown(link.key!)}
                      className={cn(
                        'flex justify-between items-center w-full px-3 py-2.5 rounded-lg text-[13px] font-bold cursor-pointer transition-colors',
                        isSubmenuActive ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={16}
                        className={cn('transition-transform duration-200', isDropOpen && 'rotate-180')}
                      />
                    </button>
                    <div
                      className={cn(
                        'pl-4 border-l-2 border-blue-100 ml-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-300',
                        isDropOpen ? 'max-h-48 opacity-100 py-1' : 'max-h-0 opacity-0'
                      )}
                    >
                      {link.submenu.map(sub => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            'block px-3 py-2 text-xs font-semibold rounded transition-colors hover:bg-blue-50 hover:text-blue-700',
                            pathname === sub.href ? 'text-blue-700 bg-blue-50/70 font-bold' : 'text-slate-500'
                          )}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    'px-3 py-2.5 rounded-lg text-[13px] font-bold transition-colors',
                    isActive ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-slate-100 px-4 py-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
              <p className="flex items-center gap-1.5"><Phone size={11} className="text-blue-600" /> {settings.mobile}</p>
              <p className="flex items-center gap-1.5"><Mail size={11} className="text-blue-600" /> {settings.email}</p>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
