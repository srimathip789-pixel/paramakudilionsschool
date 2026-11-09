'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Video, PlayCircle } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  type: string;
  created_at: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const defaultVideos = [
    {
      id: 'default-1',
      title: 'Paramakudi Lions School - Annual Day Celebration',
      url: 'https://www.youtube.com/watch?v=F3_6QOq57e4',
      type: 'youtube',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    async function loadVideos() {
      if (typeof supabase.from !== 'function') {
        setVideos(defaultVideos);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          setVideos(data);
        } else {
          setVideos(defaultVideos);
        }
      } catch (err) {
        console.error(err);
        setVideos(defaultVideos);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <Video size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Video Gallery</h1>
            <p className="text-slate-500 font-medium">Watch our latest events and school activities</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Videos Found</h3>
            <p className="text-slate-500">Check back later for exciting videos from our school!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="relative aspect-video bg-slate-900">
                  {video.type === 'youtube' && getYoutubeId(video.url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
                      title={video.title}
                      className="w-full h-full absolute inset-0"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 relative">
                       <PlayCircle size={48} className="mb-2 opacity-50 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                       <span className="text-sm font-medium z-10 text-white">Video Available</span>
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    {(!getYoutubeId(video.url) || video.type !== 'youtube') && (
                      <a href={video.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Watch Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
