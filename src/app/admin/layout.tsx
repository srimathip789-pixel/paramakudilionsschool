'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, Megaphone, Calendar, Image as ImageIcon, Video, 
  Users, Award, Download, Settings, LogOut, Menu, X, ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const supabase = createClient();

  // If we are on the login page, render children directly without the sidebar shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkUser() {
      if (isLoginPage) return;
      if (typeof supabase.auth?.getUser !== 'function') return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email || 'Admin');
      }
    }
    checkUser();
  }, [pathname, isLoginPage]);

  const handleLogout = async () => {
    if (typeof supabase.auth?.signOut === 'function') {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    }
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Notice Board', href: '/admin/notices', icon: Megaphone },
    { label: 'News & Updates', href: '/admin/news', icon: Megaphone },
    { label: 'Events Calendar', href: '/admin/events', icon: Calendar },
    { label: 'Photos', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Videos Module', href: '/admin/videos', icon: Video },
    { label: 'Committee Members', href: '/admin/members', icon: Users },
    { label: 'Staff / Teachers', href: '/admin/staff', icon: GraduationCap },
    { label: 'Achievements', href: '/admin/achievements', icon: Award },
    { label: 'Contact Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isLoginPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Branding */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-white relative overflow-hidden shrink-0 flex items-center justify-center border-2 border-primary-600">
          <img src="/images/logo.jpg" alt="Lions School Logo" className="object-cover w-full h-full" />
        </div>
        <div>
          <h2 className="font-heading font-black text-xs text-white uppercase tracking-wider">Lions School</h2>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Admin Dashboard</span>
        </div>
      </div>

      {/* Menu links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-slate-800 hover:text-white text-slate-400",
                isActive && "bg-primary-600 text-white hover:bg-primary-600"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile / Logout */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
        <div className="flex flex-col px-2">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase">Logged In As</span>
          <span className="text-xs text-slate-300 font-semibold truncate mt-0.5">{adminEmail || 'admin@lionsschool.in'}</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-20 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-heading font-black text-sm md:text-base text-slate-850 uppercase tracking-wide">
              {menuItems.find(item => pathname === item.href)?.label || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-xs font-bold text-slate-500 hover:text-primary-700 flex items-center gap-1 bg-slate-50 hover:bg-primary-50 px-3 py-1.5 rounded-xl border border-slate-200/60 transition-all"
            >
              <ArrowLeft size={12} /> Live Site
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer (Sidebar overlay) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={cn(
            "fixed left-0 top-0 bottom-0 w-64 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out transform z-50",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-850"
          >
            <X size={18} />
          </button>
          <SidebarContent />
        </div>
      </div>

    </div>
  );
}
