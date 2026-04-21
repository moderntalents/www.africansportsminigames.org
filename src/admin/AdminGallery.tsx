import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus, Upload, Trash2, X, FolderOpen, Images,
  AlertCircle, CheckCircle, Loader, UploadCloud,
} from 'lucide-react';

interface GalleryEvent {
  id: string;
  name: string;
  created_at: string;
  photo_count?: number;
}

interface GalleryPhoto {
  id: string;
  gallery_event_id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  sport_category: string;
  created_at: string;
}

const SPORT_CATEGORIES = ['General', 'Martial Arts', 'Skating', 'Football', 'Ballet', 'Chess'] as const;
type SportCategory = typeof SPORT_CATEGORIES[number];

type Toast = { type: 'success' | 'error'; message: string };

export default function AdminGallery() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SportCategory>('General');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  function showToast(type: Toast['type'], message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadEvents() {
    setLoadingEvents(true);
    const { data, error } = await supabase
      .from('gallery_events')
      .select('id, name, created_at')
      .order('created_at', { ascending: false });

    if (error) { showToast('error', 'Failed to load gallery events.'); setLoadingEvents(false); return; }

    const eventsWithCount = await Promise.all(
      (data ?? []).map(async (ev) => {
        const { count } = await supabase
          .from('gallery_photos')
          .select('id', { count: 'exact', head: true })
          .eq('gallery_event_id', ev.id);
        return { ...ev, photo_count: count ?? 0 };
      })
    );

    setEvents(eventsWithCount);
    setLoadingEvents(false);
  }

  async function loadPhotos(eventId: string) {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('gallery_event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) { showToast('error', 'Failed to load photos.'); }
    setPhotos(data ?? []);
    setLoadingPhotos(false);
  }

  useEffect(() => { loadEvents(); }, []);

  useEffect(() => {
    if (selectedEvent) loadPhotos(selectedEvent.id);
    else setPhotos([]);
  }, [selectedEvent]);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventName.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from('gallery_events')
      .insert({ name: newEventName.trim() })
      .select()
      .single();
    setCreating(false);
    if (error) { showToast('error', 'Failed to create event gallery.'); return; }
    showToast('success', `Event gallery "${data.name}" created.`);
    setNewEventName('');
    setShowCreateForm(false);
    await loadEvents();
    setSelectedEvent({ ...data, photo_count: 0 });
  }

  async function handleDeleteEvent(ev: GalleryEvent, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${ev.name}" and all its photos? This cannot be undone.`)) return;

    const { data: photosToDelete } = await supabase
      .from('gallery_photos')
      .select('storage_path')
      .eq('gallery_event_id', ev.id);

    if (photosToDelete?.length) {
      await supabase.storage.from('gallery').remove(photosToDelete.map(p => p.storage_path));
    }

    await supabase.from('gallery_events').delete().eq('id', ev.id);
    showToast('success', `"${ev.name}" deleted.`);
    if (selectedEvent?.id === ev.id) setSelectedEvent(null);
    await loadEvents();
  }

  async function uploadFiles(files: File[]) {
    if (!selectedEvent || !files.length) return;
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) { showToast('error', 'Please select image files only.'); return; }

    setUploading(true);
    setUploadProgress({ done: 0, total: imageFiles.length });

    let successCount = 0;
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop();
      const path = `${selectedEvent.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, file, { upsert: false });

      if (uploadError) { continue; }

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);
      await supabase.from('gallery_photos').insert({
        gallery_event_id: selectedEvent.id,
        storage_path: path,
        public_url: urlData.publicUrl,
        filename: file.name,
        sport_category: selectedCategory,
      });
      successCount++;
      setUploadProgress(prev => prev ? { ...prev, done: prev.done + 1 } : null);
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('success', `${successCount} of ${imageFiles.length} photo(s) uploaded.`);
    await loadPhotos(selectedEvent.id);
    await loadEvents();
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    await uploadFiles(Array.from(e.target.files));
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, [selectedEvent, uploading]);

  async function handleDeletePhoto(photo: GalleryPhoto) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    await supabase.storage.from('gallery').remove([photo.storage_path]);
    await supabase.from('gallery_photos').delete().eq('id', photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    await loadEvents();
    showToast('success', 'Photo deleted.');
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold transition-all animate-fade-in ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <FolderOpen className="w-4 h-4 text-green-600" />
                Event Galleries
              </h2>
              <button
                onClick={() => setShowCreateForm(v => !v)}
                className="w-8 h-8 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                title="Create new gallery"
              >
                {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateEvent} className="px-5 py-4 border-b border-gray-100 bg-green-50">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gallery Name</label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  placeholder="e.g. Long Jump Finals"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={creating || !newEventName.trim()}
                  className="mt-2 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Gallery'}
                </button>
              </form>
            )}

            <div className="divide-y divide-gray-50 max-h-[55vh] overflow-y-auto">
              {loadingEvents ? (
                <div className="py-10 flex justify-center">
                  <Loader className="w-6 h-6 text-gray-300 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400 px-4">
                  <Images className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No galleries yet.<br />Create one to start uploading.
                </div>
              ) : (
                events.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`flex items-center justify-between px-5 py-3.5 cursor-pointer group transition-colors ${
                      selectedEvent?.id === ev.id
                        ? 'bg-green-50 border-l-4 border-green-500'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${selectedEvent?.id === ev.id ? 'text-green-700' : 'text-gray-800'}`}>
                        {ev.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ev.photo_count} photo{ev.photo_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteEvent(ev, e)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 flex items-center justify-center transition-all"
                      title="Delete gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {!selectedEvent ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Images className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Select a Gallery</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Choose an event gallery from the left panel, or create a new one to start uploading photos.
              </p>
            </div>
          ) : (
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-200 ${
                isDragging
                  ? 'border-green-400 bg-green-50/30 shadow-green-100'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedEvent.name}</h2>
                    <p className="text-sm text-gray-400">
                      {photos.length} photo{photos.length !== 1 ? 's' : ''}
                      {uploading && uploadProgress && (
                        <span className="ml-2 text-green-600 font-semibold">
                          · Uploading {uploadProgress.done}/{uploadProgress.total}...
                        </span>
                      )}
                    </p>
                  </div>
                  <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    uploading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-200'
                  }`}>
                    {uploading
                      ? <Loader className="w-4 h-4 animate-spin" />
                      : <Upload className="w-4 h-4" />
                    }
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 flex-shrink-0">Sport Category:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SPORT_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isDragging && (
                <div
                  className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(22,163,74,0.15)', backdropFilter: 'blur(4px)' }}
                >
                  <div
                    className="text-center px-10 py-8 rounded-2xl shadow-2xl"
                    style={{ background: 'rgba(22,163,74,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    <UploadCloud className="w-12 h-12 mx-auto mb-3 text-white" />
                    <p className="text-xl font-bold text-white">Drop photos here</p>
                    <p className="text-sm text-white/75 mt-1">Release to upload</p>
                  </div>
                </div>
              )}

              {loadingPhotos ? (
                <div className="py-24 flex justify-center">
                  <Loader className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              ) : photos.length === 0 ? (
                <label className="m-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-16 cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group">
                  <div className="w-14 h-14 bg-gray-50 group-hover:bg-green-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <UploadCloud className="w-6 h-6 text-gray-300 group-hover:text-green-500 transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 group-hover:text-green-700 transition-colors">
                    Click to upload or drag &amp; drop photos
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, HEIC supported — multiple files at once</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-6">
                  <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
                    {photos.map(photo => (
                      <div key={photo.id} className="group relative mb-3 overflow-hidden rounded-xl bg-gray-100 shadow-sm break-inside-avoid">
                        <img
                          src={photo.public_url}
                          alt={photo.filename}
                          className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all flex items-center justify-center rounded-xl">
                          <button
                            onClick={() => handleDeletePhoto(photo)}
                            className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg scale-90 group-hover:scale-100"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                          <p className="text-white text-xs truncate">{photo.filename}</p>
                        </div>
                        {photo.sport_category && photo.sport_category !== 'General' && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-600/90 text-white backdrop-blur-sm shadow">
                              {photo.sport_category}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    <label className="mb-3 break-inside-avoid aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group">
                      <Plus className="w-6 h-6 text-gray-300 group-hover:text-green-500 mb-1 transition-colors" />
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-green-600 transition-colors">Add more</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
