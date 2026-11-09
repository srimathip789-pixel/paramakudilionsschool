'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Search, X, Loader2, Image as ImageIcon, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Folder, Upload, ArrowLeft
} from 'lucide-react';
import Image from 'next/image';

interface Album {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Photo {
  id: string;
  album_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Navigation State
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);

  // Form State - Albums
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');

  // Form State - Photos
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // Status Feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadAlbums();
  }, []);

  useEffect(() => {
    if (activeAlbum) {
      loadPhotos(activeAlbum.id);
    }
  }, [activeAlbum]);

  const loadAlbums = async () => {
    setLoading(true);
    if (typeof supabase.from !== 'function') {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setAlbums(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (albumId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setPhotos(data);
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

  // --- Album Actions ---
  const handleOpenCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumTitle('');
    setAlbumDescription('');
    setAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (item: Album) => {
    setEditingAlbum(item);
    setAlbumTitle(item.title);
    setAlbumDescription(item.description || '');
    setAlbumModalOpen(true);
  };

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        title: albumTitle,
        description: albumDescription
      };

      if (editingAlbum) {
        const { error } = await supabase
          .from('albums')
          .update(payload)
          .eq('id', editingAlbum.id);
        
        if (error) throw error;
        showToast('success', 'Album updated successfully!');
      } else {
        const { error } = await supabase
          .from('albums')
          .insert([payload]);
        
        if (error) throw error;
        showToast('success', 'Album added successfully!');
      }

      setAlbumModalOpen(false);
      loadAlbums();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Failed to save album.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showToast('success', 'Album deleted successfully.');
      setDeleteConfirmId(null);
      loadAlbums();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete album.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Photo Actions ---
  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlbum || photoFiles.length === 0) return;
    
    setUploading(true);
    try {
      for (const file of photoFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${activeAlbum.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('school-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('school-assets')
          .getPublicUrl(filePath);

        // Add to db
        await supabase
          .from('gallery_photos')
          .insert([{
            album_id: activeAlbum.id,
            image_url: publicUrl,
            caption: photoCaption
          }]);
      }

      showToast('success', `${photoFiles.length} photos uploaded successfully!`);
      setPhotoModalOpen(false);
      setPhotoFiles([]);
      setPhotoCaption('');
      loadPhotos(activeAlbum.id);
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showToast('success', 'Photo deleted.');
      setDeleteConfirmId(null);
      if (activeAlbum) loadPhotos(activeAlbum.id);
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to delete photo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPhoto = async (photo: Photo) => {
    const newCaption = window.prompt("Enter new caption:", photo.caption || "");
    if (newCaption === null) return; // User cancelled
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update({ caption: newCaption })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      showToast('success', 'Caption updated successfully.');
      if (activeAlbum) loadPhotos(activeAlbum.id);
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Failed to update caption.');
    } finally {
      setActionLoading(false);
    }
  };


  const filteredAlbums = albums.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {activeAlbum && (
              <button 
                onClick={() => setActiveAlbum(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeAlbum ? activeAlbum.title : 'Photos'}
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {activeAlbum ? 'Manage photos inside this album.' : 'Manage photo albums and galleries.'}
          </p>
        </div>
        
        {activeAlbum ? (
          <button 
            onClick={() => {
              setPhotoFiles([]);
              setPhotoCaption('');
              setPhotoModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload Photos
          </button>
        ) : (
          <button 
            onClick={handleOpenCreateAlbum}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Album
          </button>
        )}
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

      {!activeAlbum ? (
        // --- ALBUMS VIEW ---
        <>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search albums..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading albums...</p>
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Folder className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No albums found</p>
                <p className="text-sm text-center max-w-md">
                  {search ? 'No albums match your search criteria.' : 'Create an album to start uploading photos.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAlbums.map((item) => (
                  <div key={item.id} className="group relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveAlbum(item)}>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-8">
                      <Folder className="w-full h-full text-blue-500 opacity-20" />
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item.description || 'No description'}</p>
                    </div>
                    
                    {/* Album Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => handleOpenEditAlbum(item)}
                        className="p-1.5 bg-white shadow-sm text-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1 bg-white p-1 rounded shadow-sm">
                          <button 
                            onClick={() => handleDeleteAlbum(item.id)}
                            disabled={actionLoading}
                            className="p-1 text-white bg-red-500 hover:bg-red-600 rounded"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={actionLoading}
                            className="p-1 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 bg-white shadow-sm text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        // --- PHOTOS VIEW ---
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Album is empty</p>
              <p className="text-sm text-center max-w-md">
                Click "Upload Photos" to add images to this album.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image src={photo.image_url} alt="" fill className="object-cover" />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                      {deleteConfirmId === photo.id ? (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-full shadow-sm">
                          <button 
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={actionLoading}
                            className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={actionLoading}
                            className="p-1 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditPhoto(photo)}
                            className="p-1.5 bg-white shadow-sm text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(photo.id)}
                            className="p-1.5 bg-white shadow-sm text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {photo.caption && (
                      <p className="text-white text-xs line-clamp-2 bg-black/50 p-1 rounded">{photo.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Album Modal */}
      {albumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold">{editingAlbum ? 'Edit Album' : 'Create Album'}</h2>
              <button 
                onClick={() => setAlbumModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="album-form" onSubmit={handleAlbumSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Album Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Annual Day 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea 
                    rows={3}
                    value={albumDescription}
                    onChange={(e) => setAlbumDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                    placeholder="Optional description..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 sticky bottom-0">
              <button 
                type="button"
                onClick={() => setAlbumModalOpen(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="album-form"
                disabled={actionLoading}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingAlbum ? 'Update Album' : 'Create Album'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold">Upload Photos</h2>
              <button 
                onClick={() => setPhotoModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="photo-form" onSubmit={handleUploadPhotos} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Images (Multiple allowed) <span className="text-red-500">*</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    photoFiles.length > 0 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}>
                    <ImageIcon className={`w-10 h-10 mb-2 ${photoFiles.length > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {photoFiles.length > 0 ? `${photoFiles.length} files selected` : 'Click to select photos'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      required
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setPhotoFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                  </label>
                  
                  {photoFiles.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-2">
                      {photoFiles.slice(0, 5).map((f, i) => (
                        <span key={i} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{f.name}</span>
                      ))}
                      {photoFiles.length > 5 && (
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">+{photoFiles.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Caption (applied to all selected photos)
                  </label>
                  <input 
                    type="text" 
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Optional caption..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 sticky bottom-0">
              <button 
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="photo-form"
                disabled={uploading || photoFiles.length === 0}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
