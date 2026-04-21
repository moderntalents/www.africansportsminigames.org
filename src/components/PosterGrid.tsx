import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, FileImage, Images, ArrowDownToLine } from 'lucide-react';

interface Poster {
  id: string;
  title: string;
  description: string;
  public_url: string;
  preview_url: string | null;
  file_type: string;
  original_filename: string;
  coming_soon: boolean;
}

export default function PosterGrid() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosters() {
      const { data } = await supabase
        .from('resource_posters')
        .select('id, title, description, public_url, preview_url, file_type, original_filename, coming_soon')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      setPosters(data ?? []);
      setLoading(false);
    }
    fetchPosters();
  }, []);

  if (!loading && posters.length === 0) return null;

  return (
    <div className="mt-20 border-t border-gray-100 pt-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-green-200">
          Resource Center
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Official Posters &amp; Downloads
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Download official ASMG posters and promotional materials for free
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posters.map(poster => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </div>
      )}
    </div>
  );
}

function PosterCard({ poster }: { poster: Poster }) {
  const [hovered, setHovered] = useState(false);
  const isPdf = poster.file_type === 'pdf';
  const isStatic = poster.public_url.startsWith('/');
  const isWide = poster.public_url.includes('martial_art_poster_1');

  async function handleDownload(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      const resp = await fetch(poster.public_url);
      if (!resp.ok) throw new Error('fetch failed');
      const blob = await resp.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = poster.original_filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      }, 200);
    } catch {
      const a = document.createElement('a');
      a.href = poster.public_url;
      a.download = poster.original_filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 200);
    }
  }

  return (
    <div
      className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
        isWide ? 'sm:col-span-2' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative overflow-hidden bg-gray-50 ${isWide ? 'aspect-video' : 'aspect-[3/4]'}`}>
        {poster.preview_url ? (
          <img
            src={poster.preview_url}
            alt={poster.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-6 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-bold text-sm leading-snug mb-2 line-clamp-3">{poster.title}</p>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest px-3 py-1 bg-red-950/60 rounded-full border border-red-800/50">
              PDF Document
            </span>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-3">{poster.description}</p>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
          <div className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <Download className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isPdf ? 'bg-red-600 text-white' : 'bg-black/50 text-white backdrop-blur-sm'
          }`}>
            {poster.file_type}
          </span>
          {poster.coming_soon && (
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-white shadow">
              Coming Soon
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-600 text-white shadow">
            Free
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">
            {poster.title}
          </h3>
          {poster.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{poster.description}</p>
          )}
        </div>

        <a
          href={poster.public_url}
          onClick={handleDownload}
          rel="noreferrer"
          className="mt-4 group/btn flex items-center justify-center gap-2.5 w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm hover:shadow-green-200"
        >
          <ArrowDownToLine className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
          Download for Free
        </a>

        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <Images className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-400">Official ASMG Resource</span>
        </div>
      </div>
    </div>
  );
}
