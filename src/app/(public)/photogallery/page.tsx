'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Image as ImageIcon, ChevronLeft, Calendar, Eye } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

interface GalleryPhoto {
  id: string;
  album_id: string;
  image_url: string;
  caption?: string;
}

const defaultAlbums: Album[] = [
  { id: 'album-1', title: 'Campus & Infrastructure', description: 'Glimpses of our 3.11-acre campus and school building', created_at: new Date().toISOString() },
  { id: 'album-2', title: 'Sports & Games Meets', description: 'Students competing in Kho-Kho, Athletics, and Karate', created_at: new Date().toISOString() },
  { id: 'album-3', title: 'Kindergarten & Classrooms', description: 'Tiny tots in the air-conditioned KG block learning through play', created_at: new Date().toISOString() }
];

const defaultPhotos: GalleryPhoto[] = [
  { id: 'p1', album_id: 'album-1', image_url: '/images/gallery1.jpg', caption: 'School Front Facade' },
  { id: 'p2', album_id: 'album-1', image_url: '/images/gallery2.jpg', caption: 'Main Academic Block' },
  { id: 'p3', album_id: 'album-2', image_url: '/images/gallery3.jpg', caption: 'Boys Games Practice' },
  { id: 'p4', album_id: 'album-2', image_url: '/images/gallery4.jpg', caption: 'Athletics Team' },
  { id: 'p5', album_id: 'album-3', image_url: '/images/gallery5.jpg', caption: 'KG Activity Room' }
];

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadGallery() {
      if (typeof supabase.from !== 'function') {
        setAlbums(defaultAlbums);
        setPhotos(defaultPhotos);
        setLoading(false);
        return;
      }

      try {
        const { data: albumsData, error: err1 } = await supabase
          .from('albums')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: photosData, error: err2 } = await supabase
          .from('gallery_photos')
          .select('*');

        if (albumsData && albumsData.length > 0 && !err1) {
          setAlbums(albumsData);
          setPhotos(photosData || []);
        } else {
          setAlbums(defaultAlbums);
          setPhotos(defaultPhotos);
        }
      } catch (err) {
        console.error(err);
        setAlbums(defaultAlbums);
        setPhotos(defaultPhotos);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredPhotos = selectedAlbum 
    ? photos.filter(p => p.album_id === selectedAlbum.id)
    : [];

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-16 px-4 md:px-8 text-center">
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="max-w-4xl mx-auto z-10 relative flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-accent-500/30">
            Lions Snapshots
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
            {selectedAlbum ? selectedAlbum.title : 'Photos'}
          </h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl mx-auto leading-relaxed">
            {selectedAlbum ? selectedAlbum.description : 'Explore albums of events, cultural activities, and infrastructural updates.'}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-bold">Loading Gallery Albums...</span>
          </div>
        ) : selectedAlbum ? (
          // Photo view for selected album
          <div className="flex flex-col gap-8">
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="flex items-center gap-1 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm w-fit cursor-pointer"
            >
              <ChevronLeft size={16} /> Back to Albums
            </button>

            {filteredPhotos.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6 max-w-md mx-auto">
                <ImageIcon size={32} className="text-slate-400 mx-auto mb-2 animate-bounce" />
                <h4 className="font-bold text-slate-900 text-sm">Album is Empty</h4>
                <p className="text-slate-500 text-xs mt-1">There are no photos uploaded in this album yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id}
                    onClick={() => setLightbox(photo.image_url)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-md cursor-pointer relative aspect-4/3"
                  >
                    <img 
                      src={photo.image_url} 
                      alt={photo.caption || 'Gallery photo'} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
                        <Eye size={18} />
                      </div>
                    </div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white text-xs font-semibold leading-tight">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Albums list view
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {albums.map((album) => {
              // Find first photo in this album to use as cover
              const coverPhoto = photos.find(p => p.album_id === album.id);
              const coverUrl = coverPhoto ? coverPhoto.image_url : '/images/bg.jpg';
              const albumPhotoCount = photos.filter(p => p.album_id === album.id).length;

              return (
                <div 
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary-600/20 cursor-pointer transition-all flex flex-col group"
                >
                  <div className="h-48 relative bg-slate-100 overflow-hidden">
                    <img 
                      src={coverUrl} 
                      alt={album.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {albumPhotoCount} Photos
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-2 flex-grow">
                    <h3 className="font-heading font-black text-primary-900 text-base leading-snug group-hover:text-primary-700 transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {album.description || 'No description provided.'}
                    </p>
                    <span className="text-[10px] text-slate-400 font-extrabold mt-4 flex items-center gap-1">
                      <Calendar size={12} /> Created: {new Date(album.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox modal */}
      {lightbox && (
        <div 
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img 
              src={lightbox} 
              alt="Enlarged gallery photo" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
