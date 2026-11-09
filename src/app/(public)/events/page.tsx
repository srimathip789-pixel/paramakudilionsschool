'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { BookOpen, Calendar, MapPin, Radio, Megaphone, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  pinned: boolean;
  published_at: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  image_url?: string;
}

const defaultNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'School Reopening & Special Assembly',
    content: 'Paramakudi Lions School officially reopened for the new academic term. The day was marked by a grand special assembly where students were welcomed by our principal, Mrs. Sobana Devi, with inspiring speeches on discipline, leadership, and positive work ethic. Smart classrooms and laboratories were primed for active study.',
    pinned: true,
    published_at: new Date().toISOString()
  },
  {
    id: 'n2',
    title: 'Annual Sports Meet & Karate Demonstrations',
    content: 'Our annual sports meet took place with vast athletic participation. Standard track events, shuttle badminton, and volley ball matches were held for both boys and girls teams. The event culminated in physical self-defense coaching drills and silambam performances, which were highly appreciated by local parents.',
    pinned: false,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'n3',
    title: '100% Pass Rate in State Board Higher Secondary Exams',
    content: 'We are incredibly proud to announce that our senior secondary batch secured a 100% pass percentage. Multiple students scored above 95% proficiency metrics. The management desk hosted a celebration and awarded scholarships to the academic toppers.',
    pinned: false,
    published_at: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

const defaultEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'Science & Art Exhibition 2026',
    description: 'An interactive science display where students from grades VI to XII present working physics models, chemical reactions, computer code, and creative acrylic paintings.',
    date: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
    venue: 'School Main Auditorium'
  },
  {
    id: 'e2',
    title: 'Parent-Teacher Consultations & Report Card Review',
    description: 'A formal progress review meeting between faculty mentors and parents to discuss academic focus points, attendance records, and student behavior.',
    date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    venue: 'Respective Block Classrooms'
  },
  {
    id: 'e3',
    title: 'Lions Youth Club Social Service Camp',
    description: 'Our Lions Club students organize a rural hygiene awareness campaign and a local tree plantation drive, putting Lions humanitarian values into direct practice.',
    date: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
    venue: 'Ramanathapuram District Sector'
  }
];

export default function EventsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      if (typeof supabase.from !== 'function') {
        setNews(defaultNews);
        setEvents(defaultEvents);
        setLoading(false);
        return;
      }

      try {
        const { data: newsData, error: err1 } = await supabase
          .from('news')
          .select('*')
          .order('pinned', { ascending: false })
          .order('published_at', { ascending: false });

        const { data: eventsData, error: err2 } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (newsData && newsData.length > 0 && !err1) {
          setNews(newsData);
        } else {
          setNews(defaultNews);
        }

        if (eventsData && eventsData.length > 0 && !err2) {
          setEvents(eventsData);
        } else {
          setEvents(defaultEvents);
        }
      } catch (err) {
        console.error(err);
        setNews(defaultNews);
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            School Bulletin
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            News & Events
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            Stay updated with school activities, student notifications, examinations, and cultural festivals.
          </p>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Loading Bulletins...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* News and Announcements (8 Columns) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Megaphone className="text-primary-600" size={20} />
                <h3 className="font-heading text-xl font-extrabold text-primary-900">
                  Latest Announcements
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {news.map((item) => (
                  <div 
                    key={item.id} 
                    id={`news-${item.id}`}
                    className={`bg-white p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-4 relative overflow-hidden ${item.pinned ? 'border-primary-600/40 ring-1 ring-primary-600/10' : 'border-slate-200/60'}`}
                  >
                    {item.pinned && (
                      <span className="absolute top-0 right-0 bg-primary-700 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                        <Radio size={10} className="animate-pulse" /> Pinned
                      </span>
                    )}

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1 uppercase">
                        <Clock size={12} /> {formatDate(item.published_at)}
                      </span>
                      <h4 className="font-heading text-lg font-black text-primary-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {item.image_url && (
                        <div className="md:col-span-4 h-40 relative rounded-2xl overflow-hidden bg-slate-100">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={item.image_url ? 'md:col-span-8' : 'md:col-span-12'}>
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Timeline (4 Columns) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Calendar className="text-primary-600" size={20} />
                <h3 className="font-heading text-xl font-extrabold text-primary-900">
                  Upcoming Schedule
                </h3>
              </div>

              <div className="flex flex-col gap-6 relative pl-4 border-l border-slate-200">
                {events.map((event) => (
                  <div key={event.id} className="relative flex flex-col gap-2 bg-slate-50 p-5 rounded-2xl border border-slate-250/30">
                    
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[23px] top-6 w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white shadow-sm"></div>

                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[10px] text-secondary-700 font-extrabold uppercase bg-secondary-100/50 px-2 py-0.5 rounded">
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="font-bold text-primary-900 text-sm leading-snug">
                      {event.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold border-t border-slate-200/50 pt-2 mt-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
