'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, User, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import Image from 'next/image';

interface StaffItem {
  id: string;
  name: string;
  department: string;
  subject: string;
  qualification: string;
  experience: string;
  photo_url?: string;
  display_order: number;
  created_at: string;
}

const DEPARTMENTS = [
  'Principal',
  'P.G Assistant (HS Block)',
  'Main Block Teachers',
  'K G Block Teachers',
  'Phy.Edu.Teachers',
  'Office Staff'
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('primary');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('staff').select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mappedData = data.map((item: StaffItem) => {
          let newDept = item.department;
          if (item.name === 'Sobana Devi P' || (item.subject && item.subject.toLowerCase() === 'principal')) {
            newDept = 'Principal';
          } else {
            switch (item.department) {
              case 'high_school':
              case 'P.G. Assistant (HSC)': newDept = 'P.G Assistant (HS Block)'; break;
              case 'primary':
              case 'Secondary Grade Teacher': newDept = 'Main Block Teachers'; break;
              case 'kindergarten':
              case 'Kindergarten Teacher': newDept = 'K G Block Teachers'; break;
              case 'sports':
              case 'Physical Education': newDept = 'Phy.Edu.Teachers'; break;
              case 'office':
              case 'Office Staff': newDept = 'Office Staff'; break;
            }
          }
          return { ...item, department: newDept };
        });
        setStaff(mappedData);
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
    setEditingStaff(null);
    setName('');
    setDepartment('Main Block Teachers');
    setSubject('');
    setQualification('');
    setExperience('');
    setDisplayOrder(0);
    setImageFile(null);
    setCurrentImageUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: StaffItem) => {
    setEditingStaff(item);
    setName(item.name);
    setDepartment(item.department);
    setSubject(item.subject || '');
    setQualification(item.qualification || '');
    setExperience(item.experience || '');
    setDisplayOrder(item.display_order || 0);
    setImageFile(null);
    setCurrentImageUrl(item.photo_url || '');
    setModalOpen(true);
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    if (typeof supabase.storage?.from !== 'function') return '';
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `staff/${fileName}`;

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
      showToast('error', 'Failed to upload photo.');
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
        name,
        department,
        subject,
        qualification,
        experience,
        display_order: displayOrder,
        photo_url: finalImageUrl || null
      };

      if (editingStaff) {
        const { error } = await supabase
          .from('staff')
          .update(payload)
          .eq('id', editingStaff.id);
        
        if (error) throw error;
        showToast('success', 'Staff updated successfully!');
      } else {
        const { error } = await supabase
          .from('staff')
          .insert([payload]);
        
        if (error) throw error;
        showToast('success', 'Staff added successfully!');
      }

      setModalOpen(false);
      loadStaff();
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
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Auto reindex all remaining staff
      const { data: remainingStaff } = await supabase
        .from('staff')
        .select('id, display_order')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
        
      if (remainingStaff && remainingStaff.length > 0) {
        await Promise.all(
          remainingStaff.map((item: StaffItem, index: number) => 
            supabase.from('staff').update({ display_order: index + 1 }).eq('id', item.id)
          )
        );
      }

      showToast('success', 'Staff member deleted.');
      setDeleteConfirmId(null);
      loadStaff();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete staff.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Optimistic UI update could go here
    try {
      await supabase.from('staff').update({ display_order: newOrder }).eq('id', id);
      loadStaff(); // Reload to get correct sorted data
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination & Search
  const filtered = staff.filter(item => 
    (departmentFilter === 'all' || item.department === departmentFilter) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || 
    (item.subject && item.subject.toLowerCase().includes(search.toLowerCase())))
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDept = (dept: string) => {
    return dept;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-sm text-gray-500">Manage teachers and school staff profiles.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or subject..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <select 
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{formatDept(dept)}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500 shrink-0">
          Showing {filtered.length} staff
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading staff...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <User className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No staff members found</p>
            <p className="text-sm text-center max-w-md">
              {search || departmentFilter !== 'all' ? 'No staff match your filters.' : "You haven't added any staff yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Profile</th>
                  <th className="px-6 py-4 font-medium">Subject & Details</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Order</th>
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
                            <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 dark:text-gray-300">
                        {item.subject ? <p className="font-medium">{item.subject}</p> : <p className="italic text-gray-400">No subject</p>}
                        {item.experience && <p className="text-xs text-gray-500 mt-1">{item.experience}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {formatDept(item.department)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="w-6 text-center text-gray-500">{item.display_order}</span>
                        <div className="flex flex-col">
                          <button onClick={() => handleReorder(item.id, item.display_order, 'up')} className="text-gray-400 hover:text-blue-600">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleReorder(item.id, item.display_order, 'down')} className="text-gray-400 hover:text-blue-600">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
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
              <h2 className="text-xl font-bold">{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="staff-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{formatDept(dept)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject Taught
                    </label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Mathematics"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. B.Sc, B.Ed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Experience
                    </label>
                    <input 
                      type="text" 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. 10 Years"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Order (Sort)
                    </label>
                    <input 
                      type="number" 
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Photo
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    {currentImageUrl && !imageFile && (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                        <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
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
                      <User className={`w-8 h-8 mb-2 ${imageFile ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {imageFile ? imageFile.name : 'Click to upload photo'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG, ratio 1:1 recommended</span>
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
                form="staff-form"
                disabled={actionLoading || uploading}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {(actionLoading || uploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  editingStaff ? 'Update Staff' : 'Add Staff Member'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
