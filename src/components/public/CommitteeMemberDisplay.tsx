'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Loader2, UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface MemberItem {
  id: string;
  name: string;
  designation: string;
  description: string;
  photo_url?: string;
}

interface CommitteeMemberDisplayProps {
  roleFilter: string;
  pageTitle: string;
}

export default function CommitteeMemberDisplay({ roleFilter, pageTitle }: CommitteeMemberDisplayProps) {
  const [member, setMember] = useState<MemberItem | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadMember() {
      if (typeof supabase.from !== 'function') return;
      try {
        const { data, error } = await supabase
          .from('committee_members')
          .select('*')
          .ilike('designation', `%${roleFilter}%`)
          .order('display_order', { ascending: true })
          .limit(1)
          .single();

        if (data && !error) {
          setMember(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [roleFilter, supabase]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Management Desk
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            {pageTitle}
          </h2>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200/60 shadow-xl flex flex-col md:flex-row gap-8 items-start relative">
          
          <div className="absolute -top-5 left-10 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-lg">
            <Quote size={20} className="fill-white" />
          </div>

          {loading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="font-medium text-sm animate-pulse">Loading profile...</p>
            </div>
          ) : member ? (
            <>
              {member.photo_url && (
                <div className="shrink-0 relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md">
                  <Image 
                    src={member.photo_url} 
                    alt={member.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 flex-grow w-full">
                <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-3">
                  <h3 className="font-heading text-xl md:text-2xl font-black text-primary-900">
                    {member.name}
                  </h3>
                  <span className="text-xs text-secondary-700 font-bold uppercase tracking-wider">
                    {member.designation}
                  </span>
                </div>

                <div className="flex flex-col gap-4 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {member.description || "No message available."}
                </div>
              </div>
            </>
          ) : (
             <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <UserCircle size={48} className="text-slate-300" />
              <p className="font-medium text-sm">Profile information is being updated.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
