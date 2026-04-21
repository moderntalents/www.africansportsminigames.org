import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Radio, Save, Youtube, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface CoachStream {
  id: number;
  label: string;
  youtube_video_id: string | null;
  is_live: boolean;
}

function youtubePreviewUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function isValidYoutubeId(id: string) {
  return /^[a-zA-Z0-9_-]{11}$/.test(id.trim());
}

export default function AdminCoachStreams() {
  const [streams, setStreams] = useState<CoachStream[]>([]);
  const [drafts, setDrafts] = useState<Record<number, { videoId: string; isLive: boolean }>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('coach_streams')
        .select('*')
        .order('id');
      if (data) {
        setStreams(data);
        const d: typeof drafts = {};
        for (const s of data) {
          d[s.id] = { videoId: s.youtube_video_id ?? '', isLive: s.is_live };
        }
        setDrafts(d);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(coachId: number) {
    const draft = drafts[coachId];
    const videoId = draft.videoId.trim();

    if (videoId && !isValidYoutubeId(videoId)) {
      setErrors((e) => ({ ...e, [coachId]: 'Must be an 11-character YouTube video ID (e.g. dQw4w9WgXcQ)' }));
      return;
    }

    setErrors((e) => ({ ...e, [coachId]: '' }));
    setSaving((s) => ({ ...s, [coachId]: true }));

    const { error } = await supabase
      .from('coach_streams')
      .update({
        youtube_video_id: videoId || null,
        is_live: draft.isLive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', coachId);

    setSaving((s) => ({ ...s, [coachId]: false }));

    if (!error) {
      setSaved((s) => ({ ...s, [coachId]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [coachId]: false })), 2500);
      setStreams((prev) =>
        prev.map((s) =>
          s.id === coachId
            ? { ...s, youtube_video_id: videoId || null, is_live: draft.isLive }
            : s
        )
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Coach Streams</h2>
        <p className="text-gray-500 text-sm">
          Paste the YouTube video ID for each coach. The ID is the 11-character code at the end of a YouTube link:{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">
            youtube.com/watch?v=<span className="text-green-700 font-bold">VIDEO_ID</span>
          </code>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {streams.map((stream) => {
          const draft = drafts[stream.id] ?? { videoId: '', isLive: false };
          const isSaving = !!saving[stream.id];
          const isSaved = !!saved[stream.id];
          const err = errors[stream.id] ?? '';
          const previewId = draft.videoId.trim();
          const hasValidPreview = isValidYoutubeId(previewId);

          return (
            <div
              key={stream.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {hasValidPreview ? (
                  <img
                    src={youtubePreviewUrl(previewId)}
                    alt={`${stream.label} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Youtube className="w-10 h-10 text-gray-300 mb-2" />
                    <span className="text-gray-400 text-xs font-medium">No video ID set</span>
                  </div>
                )}
                {draft.isLive && hasValidPreview && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-xs font-bold uppercase tracking-wide">Live</span>
                  </div>
                )}
                {hasValidPreview && (
                  <a
                    href={`https://www.youtube.com/watch?v=${previewId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-lg p-1.5 transition-colors"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <Radio className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-bold text-gray-900">{stream.label}</span>
                </div>

                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  value={draft.videoId}
                  onChange={(e) => {
                    setDrafts((d) => ({ ...d, [stream.id]: { ...draft, videoId: e.target.value } }));
                    if (errors[stream.id]) setErrors((er) => ({ ...er, [stream.id]: '' }));
                  }}
                  placeholder="e.g. dQw4w9WgXcQ"
                  maxLength={11}
                  className={`w-full font-mono text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    err
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                  }`}
                />
                {err && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {err}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() =>
                        setDrafts((d) => ({
                          ...d,
                          [stream.id]: { ...draft, isLive: !draft.isLive },
                        }))
                      }
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        draft.isLive ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          draft.isLive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${draft.isLive ? 'text-red-600' : 'text-gray-400'}`}>
                      {draft.isLive ? 'Marked Live' : 'Offline'}
                    </span>
                  </label>

                  <button
                    onClick={() => handleSave(stream.id)}
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      isSaved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSaved ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
