'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Download, Calendar, Tag, ShieldQuestion } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DownloadItem {
  id: string;
  title: string;
  file_url: string;
  category: string;
  created_at: string;
}

const defaultDownloads: DownloadItem[] = [
  {
    id: 'd1',
    title: 'School Admission Form 2026-2027',
    file_url: '#',
    category: 'admission',
    created_at: new Date().toISOString()
  },
  {
    id: 'd2',
    title: 'Lions School Prospectus & Guidelines',
    file_url: '#',
    category: 'admission',
    created_at: new Date().toISOString()
  },
  {
    id: 'd3',
    title: 'HSC Examination Timetable - Class XII Board',
    file_url: '#',
    category: 'timetable',
    created_at: new Date().toISOString()
  },
  {
    id: 'd4',
    title: 'Circular: Annual Science Exhibition Guidelines',
    file_url: '#',
    category: 'circular',
    created_at: new Date().toISOString()
  }
];

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadDownloads() {
      if (typeof supabase.from !== 'function') {
        setDownloads(defaultDownloads);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('downloads')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          setDownloads(data);
        } else {
          setDownloads(defaultDownloads);
        }
      } catch (err) {
        console.error(err);
        setDownloads(defaultDownloads);
      } finally {
        setLoading(false);
      }
    }
    loadDownloads();
  }, []);

  const categories = [
    { key: 'admission', label: 'Admission Forms & Prospectus' },
    { key: 'circular', label: 'Recent School Circulars' },
    { key: 'timetable', label: 'Class & Examination Timetables' },
    { key: 'syllabus', label: 'Syllabus & Scheme of Studies' },
    { key: 'other', label: 'Other Documents' }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Document Center
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            Downloads & Forms
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Access circulars, timetables, syllabus documents, and admission prospectus instantly in PDF format.
          </p>
        </div>
      </section>

      {/* Downloads list */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Loading Documents...</span>
          </div>
        ) : (
          categories.map((cat) => {
            const items = downloads.filter(d => d.category === cat.key);
            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="flex flex-col gap-4">
                <h3 className="font-heading text-base md:text-lg font-black text-primary-900 border-l-4 border-primary-600 pl-2 uppercase tracking-wide">
                  {cat.label}
                </h3>
                
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between gap-4 hover:border-primary-600/20 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-snug truncate">
                            {item.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-extrabold flex items-center gap-1 mt-0.5">
                            <Calendar size={10} /> Added: {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>

                      <a 
                        href={item.file_url === '#' ? '#' : item.file_url}
                        onClick={(e) => {
                          if (item.file_url === '#') {
                            e.preventDefault();
                            alert("This is a demo placeholder document. Admin will upload the actual PDF files shortly.");
                          }
                        }}
                        download
                        className="bg-primary-900 hover:bg-primary-950 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Download size={12} /> <span className="hidden sm:inline">Download PDF</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

      </section>

    </div>
  );
}
