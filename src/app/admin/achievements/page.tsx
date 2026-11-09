'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, Award, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Image as ImageIcon, FileText
} from 'lucide-react';
import Image from 'next/image';

interface AchievementItem {
  id: string;
  student_name: string;
  competition: string;
  achievement: string;
  photo_url?: string;
  certificate_url?: string;
  created_at: string;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [competition, setCompetition] = useState('');
  const [achievementDesc, setAchievementDesc] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setAchievements(data);
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
    setEditingAchievement(null);
    setStudentName('');
    setCompetition('');
    setAchievementDesc('');
    setPhotoFile(null);
    setCurrentPhotoUrl('');
    setCertificateFile(null);
    setCurrentCertificateUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AchievementItem) => {
    setEditingAchievement(item);
    setStudentName(item.student_name);
    setCompetition(item.competition);
    setAchievementDesc(item.achievement);
    setPhotoFile(null);
    setCurrentPhotoUrl(item.photo_url || '');
    setCertificateFile(null);
    setCurrentCertificateUrl(item.certificate_url || '');
    setModalOpen(true);
  };

  const handleUploadFile = async (file: File, folder: string): Promise<string> => {
    if (typeof supabase.storage?.from !== 'function') return '';
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

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
      showToast('error', `Failed to upload ${folder} file.`);
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      let finalPhotoUrl = currentPhotoUrl;
      let finalCertUrl = currentCertificateUrl;

      if (photoFile) {
        finalPhotoUrl = await handleUploadFile(photoFile, 'achievements');
        if (!finalPhotoUrl) {
          setActionLoading(false);
          return;
        }
      }

      if (certificateFile) {
        finalCertUrl = await handleUploadFile(certificateFile, 'certificates');
        if (!finalCertUrl) {
          setActionLoading(false);
          return;
        }
      }

      const payload = {
        student_name: studentName,
        competition,
        achievement: achievementDesc,
        photo_url: finalPhotoUrl || null,
        certificate_url: finalCertUrl || null
      };

      if (editingAchievement) {
        const { error } = await supabase
          .from('achievements')
          .update(payload)
          .eq('id', editingAchievement.id);
        
        if (error) throw error;
        showToast('success', 'Achievement updated successfully!');
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([payload]);
        
        if (error) throw error;
        showToast('success', 'Achievement added successfully!');
      }

      setModalOpen(false);
      loadAchievements();
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
        .from('achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showToast('success', 'Achievement deleted successfully.');
      setDeleteConfirmId(null);
      loadAchievements();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete achievement.');
    } finally {
      setActionLoading(false);
    }
  };

  // Pagination & Search
  const filtered = achievements.filter(item => 
    item.student_name.toLowerCase().includes(search.toLowerCase()) || 
    item.competition.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Achievements</h1>
          <p className="text-sm text-gray-500">Manage student awards and recognitions.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
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
            placeholder="Search by student or competition..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filtered.length} achievements
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading achievements...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Award className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No achievements found</p>
            <p className="text-sm text-center max-w-md">
              {search ? 'No achievements match your search criteria.' : "You haven't added any achievements yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Student & Achievement</th>
                  <th className="px-6 py-4 font-medium">Competition</th>
                  <th className="px-6 py-4 font-medium">Media</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.photo_url ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
                            <Image src={item.photo_url} alt={item.student_name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-100">
                            <Award className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{item.student_name}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.achievement}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {item.competition}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.certificate_url && (
                          <a href={item.certificate_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" title="View Certificate">
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        {!item.certificate_url && <span className="text-xs text-gray-400">No cert</span>}
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
              <h2 className="text-xl font-bold">{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="achievement-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Competition Event <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={competition}
                      onChange={(e) => setCompetition(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. State Level Chess"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Achievement Details <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={achievementDesc}
                    onChange={(e) => setAchievementDesc(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. First Prize Winner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student Photo
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {currentPhotoUrl && !photoFile && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                          <Image src={currentPhotoUrl} alt="Current" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={() => setCurrentPhotoUrl('')}
                            className="absolute top-1 right-1 p-0.5 bg-white/80 text-red-600 rounded-full hover:bg-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <label className={`flex-1 flex flex-col items-center justify-center px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        photoFile ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}>
                        <ImageIcon className={`w-6 h-6 mb-1 ${photoFile ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {photoFile ? photoFile.name : 'Upload Photo'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) setPhotoFile(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Certificate / Award Document
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {currentCertificateUrl && !certificateFile && (
                        <div className="relative p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">Certificate</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setCurrentCertificateUrl('')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {(!currentCertificateUrl || certificateFile) && (
                        <label className={`flex-1 flex flex-col items-center justify-center px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          certificateFile ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}>
                          <FileText className={`w-6 h-6 mb-1 ${certificateFile ? 'text-amber-500' : 'text-gray-400'}`} />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {certificateFile ? certificateFile.name : 'Upload Certificate'}
                          </span>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) setCertificateFile(e.target.files[0]);
                            }}
                          />
                        </label>
                      )}
                    </div>
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
                form="achievement-form"
                disabled={actionLoading || uploading}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {(actionLoading || uploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  editingAchievement ? 'Update Achievement' : 'Add Achievement'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
