import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, FileImage, AlertCircle, CheckCircle, Loader, UploadCloud, GripVertical, CreditCard as Edit2, Check, X } from 'lucide-react';

interface Poster {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  public_url: string;
  preview_url: string | null;
  file_type: string;
  original_filename: string;
  display_order: number;
  created_at: string;
}

type Toast = { type: 'success' | 'error'; message: string };

export default function AdminPosters() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  function showToast(type: Toast['type'], message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadPosters() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resource_posters')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) showToast('error', 'Failed to load posters.');
    setPosters(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadPosters(); }, []);

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    const allowed = files.filter(f =>
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    if (!allowed.length) {
      showToast('error', 'Only images (JPEG, PNG, WebP) and PDF files are supported.');
      return;
    }

    setUploading(true);
    setUploadProgress({ done: 0, total: allowed.length });
    let successCount = 0;

    for (const file of allowed) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('posters')
        .upload(path, file, { upsert: false });

      if (uploadError) { continue; }

      const { data: urlData } = supabase.storage.from('posters').getPublicUrl(path);
      const isPdf = file.type === 'application/pdf';
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      await supabase.from('resource_posters').insert({
        title,
        description: '',
        storage_path: path,
        public_url: urlData.publicUrl,
        preview_url: isPdf ? null : urlData.publicUrl,
        file_type: ext,
        original_filename: file.name,
        display_order: posters.length + successCount,
      });

      successCount++;
      setUploadProgress(prev => prev ? { ...prev, done: prev.done + 1 } : null);
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('success', `${successCount} of ${allowed.length} poster(s) uploaded.`);
    await loadPosters();
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    await uploadFiles(Array.from(e.target.files));
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    await uploadFiles(Array.from(e.dataTransfer.files));
  }, [posters.length, uploading]);

  async function handleDelete(poster: Poster) {
    if (!confirm(`Delete "${poster.title}"? This cannot be undone.`)) return;
    await supabase.storage.from('posters').remove([poster.storage_path]);
    await supabase.from('resource_posters').delete().eq('id', poster.id);
    setPosters(prev => prev.filter(p => p.id !== poster.id));
    showToast('success', 'Poster deleted.');
  }

  function startEdit(poster: Poster) {
    setEditingId(poster.id);
    setEditTitle(poster.title);
    setEditDesc(poster.description);
  }

  async function saveEdit(poster: Poster) {
    await supabase.from('resource_posters').update({
      title: editTitle.trim() || poster.original_filename,
      description: editDesc.trim(),
    }).eq('id', poster.id);
    setPosters(prev => prev.map(p =>
      p.id === poster.id ? { ...p, title: editTitle.trim() || poster.original_filename, description: editDesc.trim() } : p
    ));
    setEditingId(null);
    showToast('success', 'Poster updated.');
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative bg-white rounded-2xl border-2 shadow-sm transition-all duration-200 ${
          isDragging ? 'border-green-400 bg-green-50/30' : 'border-gray-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Event Posters &amp; Downloads</h2>
            <p className="text-sm text-gray-400">
              {posters.length} poster{posters.length !== 1 ? 's' : ''} published
              {uploading && uploadProgress && (
                <span className="ml-2 text-green-600 font-semibold">
                  · Uploading {uploadProgress.done}/{uploadProgress.total}...
                </span>
              )}
            </p>
          </div>
          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex-shrink-0 ${
            uploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
          }`}>
            {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Add Posters'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {isDragging && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center rounded-2xl">
            <div className="bg-green-600/90 text-white rounded-2xl px-8 py-6 text-center shadow-2xl">
              <UploadCloud className="w-10 h-10 mx-auto mb-2" />
              <p className="text-lg font-bold">Drop posters here</p>
              <p className="text-sm opacity-80 mt-1">JPEG, PNG, PDF supported</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader className="w-8 h-8 text-gray-300 animate-spin" />
          </div>
        ) : posters.length === 0 ? (
          <label className="m-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-20 cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group">
            <div className="w-14 h-14 bg-gray-50 group-hover:bg-green-100 rounded-full flex items-center justify-center mb-3 transition-colors">
              <UploadCloud className="w-6 h-6 text-gray-300 group-hover:text-green-500 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-gray-500 group-hover:text-green-700 transition-colors">
              Click to upload or drag &amp; drop posters
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, PDF — multiple files at once</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              disabled={uploading}
              className="hidden"
            />
          </label>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posters.map(poster => (
                <div key={poster.id} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="relative aspect-[3/4] bg-gray-200">
                    {poster.preview_url ? (
                      <img
                        src={poster.preview_url}
                        alt={poster.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                        <FileImage className="w-12 h-12 text-red-400 mb-2" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">PDF</span>
                        <span className="text-xs text-gray-400 mt-1 px-3 text-center truncate w-full">
                          {poster.original_filename}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(poster)}
                        className="w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-green-700 rounded-lg flex items-center justify-center shadow transition-colors"
                        title="Edit title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(poster)}
                        className="w-8 h-8 bg-white/90 hover:bg-red-600 text-gray-600 hover:text-white rounded-lg flex items-center justify-center shadow transition-colors"
                        title="Delete poster"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-sm">
                        {poster.file_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    {editingId === poster.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="Poster title"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="Short description (optional)"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(poster)}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-800 leading-tight truncate">{poster.title}</p>
                        {poster.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{poster.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-xs text-gray-400">
                            {new Date(poster.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <label className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group">
                <Plus className="w-7 h-7 text-gray-300 group-hover:text-green-500 mb-1.5 transition-colors" />
                <span className="text-xs font-semibold text-gray-400 group-hover:text-green-600 transition-colors">Add poster</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileInput}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
