'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, Video, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle, PlayCircle
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  type: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('youtube');

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setTitle('');
    setVideoUrl('');
    setVideoType('youtube');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: VideoItem) => {
    setEditingVideo(item);
    setTitle(item.title);
    setVideoUrl(item.url);
    setVideoType(item.type);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        title,
        url: videoUrl,
        type: videoType
      };

      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(payload)
          .eq('id', editingVideo.id);
        
        if (error) throw error;
        showToast('success', 'Video updated successfully!');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([payload]);
        
        if (error) throw error;
        showToast('success', 'Video added successfully!');
      }

      setModalOpen(false);
      loadVideos();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showToast('success', 'Video deleted successfully.');
      setDeleteConfirmId(null);
      loadVideos();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete video.');
    } finally {
      setActionLoading(false);
    }
  };

  // Pagination & Search
  const filtered = videos.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper for YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video Gallery</h1>
          <p className="text-sm text-gray-500">Manage embedded YouTube videos and MP4 links.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Toast Notification */}
      {status && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <h4 className="font-medium">{status.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm opacity-90">{status.message}</p>
          </div>
          <button onClick={() => setStatus(null)} className="ml-auto opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search videos..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filtered.length} videos
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading videos...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Video className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No videos found</p>
            <p className="text-sm text-center max-w-md">
              {search ? 'No videos match your search criteria.' : "You haven't added any videos yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {currentItems.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all">
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {item.type === 'youtube' && getYouTubeId(item.url) ? (
                    <img 
                      src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/mqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlayCircle className="w-12 h-12 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-white p-1 rounded-full">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={actionLoading}
                          className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-full"
                        >
                          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={actionLoading}
                          className="p-1.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 uppercase tracking-wide">
                      {item.type}
                    </span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold">{editingVideo ? 'Edit Video' : 'Add Video'}</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="video-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Annual Day Celebration 2024"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Video Source Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={videoType}
                      onChange={(e) => setVideoType(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="youtube">YouTube URL</option>
                      <option value="mp4">Direct MP4 URL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="url" 
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com/video.mp4'}
                  />
                  {videoType === 'youtube' && videoUrl && getYouTubeId(videoUrl) && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <iframe 
                        width="100%" 
                        height="200" 
                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 sticky bottom-0">
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="video-form"
                disabled={actionLoading}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingVideo ? 'Update Video' : 'Add Video'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
