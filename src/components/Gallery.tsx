import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Images, ArrowLeft, X, ChevronLeft, ChevronRight,
  Calendar, Download, ZoomIn,
} from 'lucide-react';

interface GalleryEvent {
  id: string;
  name: string;
  created_at: string;
  cover_url?: string;
  photo_count: number;
}

interface GalleryPhoto {
  id: string;
  public_url: string;
  filename: string;
  sport_category: string;
}

const FILTER_CATEGORIES = ['All', 'General', 'Martial Arts', 'Skating', 'Football', 'Ballet', 'Chess'] as const;
type FilterCategory = typeof FILTER_CATEGORIES[number];

async function downloadPhoto(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename || 'photo.jpg';
    a.click();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, '_blank');
  }
}

export default function Gallery() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data } = await supabase
        .from('gallery_events')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      if (!data) { setLoading(false); return; }

      const enriched = await Promise.all(
        data.map(async (ev) => {
          const { data: firstPhoto } = await supabase
            .from('gallery_photos')
            .select('public_url')
            .eq('gallery_event_id', ev.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          const { count } = await supabase
            .from('gallery_photos')
            .select('id', { count: 'exact', head: true })
            .eq('gallery_event_id', ev.id);

          return {
            ...ev,
            cover_url: firstPhoto?.public_url,
            photo_count: count ?? 0,
          };
        })
      );

      setEvents(enriched.filter(ev => ev.photo_count > 0));
      setLoading(false);
    }
    fetchEvents();
  }, []);

  async function openEvent(ev: GalleryEvent) {
    setSelectedEvent(ev);
    setActiveFilter('All');
    setLoadingPhotos(true);
    const { data } = await supabase
      .from('gallery_photos')
      .select('id, public_url, filename, sport_category')
      .eq('gallery_event_id', ev.id)
      .order('created_at', { ascending: true });
    setPhotos(data ?? []);
    setLoadingPhotos(false);
  }

  const filteredPhotos = activeFilter === 'All'
    ? photos
    : photos.filter(p => (p.sport_category || 'General') === activeFilter);

  const visibleCategories = FILTER_CATEGORIES.filter(cat => {
    if (cat === 'All') return true;
    return photos.some(p => (p.sport_category || 'General') === cat);
  });

  function closeLightbox() { setLightboxIndex(null); }

  function prevPhoto() {
    setLightboxIndex(i => (i !== null ? (i - 1 + filteredPhotos.length) % filteredPhotos.length : null));
  }

  function nextPhoto() {
    setLightboxIndex(i => (i !== null ? (i + 1) % filteredPhotos.length : null));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filteredPhotos.length]);

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={closeLightbox}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${currentPhoto.public_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px)',
            }}
          />

          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              downloadPhoto(currentPhoto.public_url, currentPhoto.filename);
            }}
            className="absolute top-5 right-20 z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-xs font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>

          <button
            onClick={e => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <div
            className="relative z-10 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentPhoto.public_url}
              alt={currentPhoto.filename}
              className="max-h-[82vh] max-w-[88vw] rounded-2xl object-contain shadow-2xl"
              style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}
            />
            <div
              className="mt-4 flex items-center gap-4 px-5 py-2.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <p className="text-white/60 text-xs truncate max-w-[220px]">{currentPhoto.filename}</p>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs font-semibold">{(lightboxIndex ?? 0) + 1} / {filteredPhotos.length}</span>
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {filteredPhotos.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`rounded-full transition-all ${i === lightboxIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedEvent ? (
          <>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-green-200">
                Photo Gallery
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Captured Moments</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Moments of excellence, unity, and celebration from the African Sports Mini Games
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Images className="w-9 h-9 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Gallery Coming Soon</h3>
                <p className="text-gray-400">Photos will appear here after the event. Check back soon!</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-0">
                {events.map((ev, i) => (
                  <button
                    key={ev.id}
                    onClick={() => openEvent(ev)}
                    className={`group relative w-full mb-5 overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 block ${
                      i % 3 === 0 ? 'aspect-[4/3]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-200">
                      {ev.cover_url ? (
                        <img
                          src={ev.cover_url}
                          alt={ev.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Images className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}
                      >
                        <ZoomIn className="w-4 h-4" />
                        View Gallery
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white text-lg font-bold leading-tight mb-2">{ev.name}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <Images className="w-3 h-3" />
                          {ev.photo_count} photo{ev.photo_count !== 1 ? 's' : ''}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <Calendar className="w-3 h-3" />
                          {new Date(ev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <button
                onClick={() => { setSelectedEvent(null); setPhotos([]); setActiveFilter('All'); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Galleries
              </button>
              <span className="hidden sm:block text-gray-300">/</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
              </div>
            </div>

            {visibleCategories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {visibleCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveFilter(cat); setLightboxIndex(null); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                      activeFilter === cat
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'
                    }`}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({photos.filter(p => (p.sport_category || 'General') === cat).length})
                      </span>
                    )}
                    {cat === 'All' && (
                      <span className="ml-1.5 text-xs opacity-70">({photos.length})</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {loadingPhotos ? (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`mb-4 rounded-xl bg-gray-100 animate-pulse w-full ${
                      i % 4 === 0 ? 'aspect-[4/3]' : i % 4 === 1 ? 'aspect-square' : i % 4 === 2 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                    }`}
                  />
                ))}
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="text-center py-20">
                <Images className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No photos in this category yet.</p>
              </div>
            ) : (
              <>
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
                  {filteredPhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="group relative mb-4 w-full overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 block"
                    >
                      <img
                        src={photo.public_url}
                        alt={photo.filename}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 block cursor-pointer"
                        loading="lazy"
                        onClick={() => setLightboxIndex(idx)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-xl" />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => setLightboxIndex(idx)}
                          className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
                          title="View photo"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            downloadPhoto(photo.public_url, photo.filename);
                          }}
                          className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
                          title="Download photo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-center text-sm text-gray-400">
                  {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
                  {activeFilter !== 'All' ? ` in ${activeFilter}` : ' in this gallery'}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
