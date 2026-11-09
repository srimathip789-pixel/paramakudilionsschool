'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, FileText, 
  Upload, Calendar, AlertCircle, CheckCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Notice {
  id: string;
  title: string;
  pdf_url?: string;
  expiry_date?: string;
  created_at: string;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setNotices(data);
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
    setEditingNotice(null);
    setTitle('');
    setExpiryDate('');
    setPdfFile(null);
    setCurrentPdfUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setExpiryDate(notice.expiry_date || '');
    setPdfFile(null);
    setCurrentPdfUrl(notice.pdf_url || '');
    setModalOpen(true);
  };

  const handleUploadPDF = async (file: File): Promise<string> => {
    if (typeof supabase.storage?.from !== 'function') return '';
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `notices/${fileName}`;

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
      showToast('error', 'Failed to upload PDF file.');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      let finalPdfUrl = currentPdfUrl;
      if (pdfFile) {
        finalPdfUrl = await handleUploadPDF(pdfFile);
        if (!finalPdfUrl) {
          setActionLoading(false);
          return;
        }
      }

      const payload = {
        title,
        expiry_date: expiryDate || null,
        pdf_url: finalPdfUrl || null
      };

      if (editingNotice) {
        // Update
        const { error } = await supabase
          .from('notices')
          .update(payload)
          .eq('id', editingNotice.id);
        
        if (error) throw error;
        showToast('success', 'Notice updated successfully!');
      } else {
        // Create
        const { error } = await supabase
          .from('notices')
          .insert([payload]);

        if (error) throw error;
        showToast('success', 'Notice created successfully!');
      }

      setModalOpen(false);
      loadNotices();
    } catch (err: any) {
      console.error(err);
      showToast('error', err?.message || 'An error occurred while saving.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('success', 'Notice deleted successfully!');
      setDeleteConfirmId(null);
      loadNotices();
    } catch (err: any) {
      console.error(err);
      showToast('error', err?.message || 'Failed to delete notice.');
    } finally {
      setActionLoading(false);
    }
  };

  // Search and Pagination logic
  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Alert */}
      {status && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold transition-all max-w-sm bg-white ${
          status.type === 'success' ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Header operations */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-250 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent font-semibold"
          />
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2 px-4 rounded-2xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add Notice
        </button>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <Loader2 size={32} className="animate-spin text-primary-600" />
          <span className="text-xs text-slate-400 font-bold mt-2">Loading Notices...</span>
        </div>
      ) : paginatedNotices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-xl mx-auto w-full p-6 flex flex-col items-center gap-3">
          <FileText size={40} className="text-slate-300" />
          <h4 className="font-bold text-primary-900 text-sm">No Notices Found</h4>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
            {search ? 'No results matched your search term.' : 'There are no active notice board alerts. Click "Add Notice" to broadcast your first announcement.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50 font-extrabold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Title Announcement</th>
                  <th scope="col" className="px-6 py-4">Publish Date</th>
                  <th scope="col" className="px-6 py-4">Expiry Date</th>
                  <th scope="col" className="px-6 py-4">PDF Flyer</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                {paginatedNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 max-w-xs md:max-w-md truncate font-bold text-primary-950">
                      {notice.title}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(notice.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {notice.expiry_date ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          new Date(notice.expiry_date) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {notice.expiry_date}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Never Expires</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {notice.pdf_url ? (
                        <a 
                          href={notice.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-750 hover:underline flex items-center gap-1"
                        >
                          <FileText size={14} /> View File
                        </a>
                      ) : (
                        <span className="text-slate-400 font-normal">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                      <button 
                        onClick={() => handleOpenEdit(notice)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-primary-600/30 text-slate-500 hover:text-primary-600 hover:bg-primary-50/30 cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-red-600/30 text-slate-500 hover:text-red-600 hover:bg-red-50/30 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 px-6 py-4 flex justify-between items-center text-xs font-bold text-slate-500 bg-slate-50/40">
              <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredNotices.length)} of {filteredNotices.length} notices</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRUD Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200/50 shadow-2xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-primary-900 text-sm uppercase">
                {editingNotice ? 'Edit Notice' : 'Add Notice'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide">Notice Title / Alert Text</label>
                <textarea
                  required
                  rows={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary-600 font-semibold"
                  placeholder="e.g. Admission registration open for classes LKG to XI..."
                ></textarea>
              </div>

              {/* Expiry Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide">Expiry Date (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={14} />
                  </div>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 font-semibold"
                  />
                </div>
                <span className="text-[9px] text-slate-400 font-medium">Notice will be marked expired or hidden on public list once date passes. Leave blank for infinite.</span>
              </div>

              {/* PDF File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide">PDF Circular Document (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-primary-600/35 transition-colors cursor-pointer relative bg-slate-50">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload size={20} className="text-slate-400" />
                    <span className="text-slate-500 font-semibold text-[10px]">
                      {pdfFile ? pdfFile.name : (currentPdfUrl ? 'PDF is attached (Upload to replace)' : 'Click to upload PDF document')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-slate-250 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || actionLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {(uploading || actionLoading) ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Notice'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200/50 shadow-2xl p-6 flex flex-col gap-5 text-center">
            <h3 className="font-heading font-black text-slate-800 text-base uppercase">Confirm Delete</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-semibold">
              Are you sure you want to delete this notice? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 justify-center mt-2 font-bold text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="border border-slate-250 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {actionLoading && <Loader2 size={12} className="animate-spin" />} Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
