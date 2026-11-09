'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, Image as ImageIcon, 
  Calendar, CheckCircle, ChevronLeft, ChevronRight, Pin, AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  pinned: boolean;
  published_at: string;
  created_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false });

      if (data && !error) {
        setNews(data);
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
    setEditingNews(null);
    setTitle('');
    setContent('');
    setPinned(false);
    setPublishedAt(new Date().toISOString().slice(0, 16));
    setImageFile(null);
    setCurrentImageUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingNews(item);
    setTitle(item.title);
    setContent(item.content);
    setPinned(item.pinned);
    setPublishedAt(item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : '');
    setImageFile(null);
    setCurrentImageUrl(item.image_url || '');
    setModalOpen(true);
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    if (typeof supabase.storage?.from !== 'function') return '';
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('school-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to upload image.');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      let finalImageUrl = currentImageUrl;
      if (imageFile) {
        finalImageUrl = await handleUploadImage(imageFile);
        if (!finalImageUrl) {
          setActionLoading(false);
          return;
        }
      }

      const payload = {
        title,
        content,
        pinned,
        published_at: publishedAt || new Date().toISOString(),
        image_url: finalImageUrl || null
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(payload)
          .eq('id', editingNews.id);
        
        if (error) throw error;
        showToast('success', 'News updated successfully!');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([payload]);
        
        if (error) throw error;
        showToast('success', 'News added successfully!');
      }

      setModalOpen(false);
      loadNews();
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
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showToast('success', 'News deleted successfully.');
      setDeleteConfirmId(null);
      loadNews();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete news.');
    } finally {
      setActionLoading(false);
    }
  };

  // Pagination & Search
  const filtered = news.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.content.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News & Announcements</h1>
          <p className="text-sm text-gray-500">Manage school news, updates, and announcements.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add News
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
            placeholder="Search news..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filtered.length} news items
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading news...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No news found</p>
            <p className="text-sm text-center max-w-md">
              {search ? "No news match your search criteria." : "You haven't added any news yet. Click the 'Add News' button to create one."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Article</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
                            <Image src={item.image_url} alt="" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.pinned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.published_at || item.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {deleteConfirmId === item.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-500 font-medium">Sure?</span>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              disabled={actionLoading}
                              className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded"
                            >
                              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(null)}
                              disabled={actionLoading}
                              className="p-1.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold">{editingNews ? 'Edit News' : 'Add News'}</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="news-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter news title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                    placeholder="Enter full news content..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Published Date
                    </label>
                    <input 
                      type="datetime-local" 
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${pinned ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${pinned ? 'translate-x-4' : ''}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pin to top</span>
                    </label>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured Image
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    {currentImageUrl && !imageFile && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={currentImageUrl} alt="Current" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => setCurrentImageUrl('')}
                          className="absolute top-1 right-1 p-1 bg-white/80 text-red-600 rounded-full hover:bg-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    <label className={`flex-1 flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      imageFile ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}>
                      <ImageIcon className={`w-8 h-8 mb-2 ${imageFile ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
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
                form="news-form"
                disabled={actionLoading || uploading}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {(actionLoading || uploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  editingNews ? 'Update News' : 'Publish News'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
