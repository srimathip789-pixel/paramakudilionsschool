'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users } from 'lucide-react';

interface MemberItem {
  id?: string;
  name: string;
  designation: string;
  description: string;
  photo_url?: string;
  display_order?: number;
}

export default function MembersPage() {
  const [memberList, setMemberList] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadMembers() {
      if (typeof supabase.from !== 'function') {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('committee_members')
          .select('*')
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });
        
        if (data && data.length > 0 && !error) {
          setMemberList(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [supabase]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            School Management
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Committee Members
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Meet our dedicated committee members who oversee and guide our institution.
          </p>
        </div>
      </section>

      {/* Main Directory */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Loading Committee Members...</span>
          </div>
        ) : memberList.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <h3 className="font-heading text-lg md:text-xl font-extrabold text-primary-900">
                Committee Members
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberList.map((member, idx) => (
                <div 
                  key={member.id || idx} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary-600/30 transition-all flex items-center gap-4"
                >
                  {/* Photo wrapper */}
                  <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 overflow-hidden relative border border-slate-100 font-extrabold text-xl shadow-sm">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-extrabold text-primary-900 text-sm leading-snug">{member.name}</h4>
                    <span className="text-xs text-secondary-700 font-semibold">{member.designation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 font-semibold">
            No committee members available at this time.
          </div>
        )}
      </section>

    </div>
  );
}
