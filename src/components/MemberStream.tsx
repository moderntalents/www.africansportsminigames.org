import { useEffect, useState } from 'react';
import { Lock, Radio, Users, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CoachStream {
  id: number;
  label: string;
  youtube_video_id: string | null;
  is_live: boolean;
}

function VideoPlayer({ coach }: { coach: CoachStream }) {
  if (coach.is_live && coach.youtube_video_id) {
    return (
      <iframe
        key={coach.youtube_video_id}
        src={`https://www.youtube.com/embed/${coach.youtube_video_id}?autoplay=1&rel=0`}
        title={coach.label}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-green-950 select-none">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Lock className="w-9 h-9 text-green-400/70" />
      </div>
      <p className="text-white font-bold text-xl mb-1">Stream Not Started</p>
      <p className="text-gray-400 text-sm mb-6">Waiting for {coach.label} to go live</p>
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.25)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
        <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Locked</span>
      </div>
    </div>
  );
}

export default function MemberStream() {
  const [coaches, setCoaches] = useState<CoachStream[]>([]);
  const [activeId, setActiveId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prev = document.title;
    document.title = 'ASMG Member Stream 2026';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.title = prev;
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    async function fetchStreams() {
      const { data } = await supabase
        .from('coach_streams')
        .select('id, label, youtube_video_id, is_live')
        .order('id');
      if (data && data.length > 0) {
        setCoaches(data);
        setActiveId(data[0].id);
      }
      setLoading(false);
    }
    fetchStreams();

    const channel = supabase
      .channel('coach_streams_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'coach_streams' },
        (payload) => {
          setCoaches((prev) =>
            prev.map((c) => (c.id === payload.new.id ? (payload.new as CoachStream) : c))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeCoach = coaches.find((c) => c.id === activeId) ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-5 py-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
            <span className="text-red-300 font-bold text-sm uppercase tracking-widest">ASMG Live — Members Access</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            ASMG Live: July 25th, 2026
          </h1>
          <p className="text-gray-300 text-base">
            Streaming <span className="text-green-400 font-bold">5 coach channels</span> live from{' '}
            <span className="text-white font-bold">Kenyatta University</span>. Stream begins at{' '}
            <span className="text-white font-bold">8:00 AM</span>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <aside className="lg:w-56 flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Coach Streams</span>
                </div>
              </div>
              <div className="p-2 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible">
                {coaches.map((coach) => {
                  const isActive = activeId === coach.id;
                  const isLive = coach.is_live && !!coach.youtube_video_id;
                  return (
                    <button
                      key={coach.id}
                      onClick={() => setActiveId(coach.id)}
                      className={`flex-shrink-0 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 focus:outline-none ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      style={
                        isActive
                          ? {
                              background: 'rgba(22,163,74,0.2)',
                              border: '1px solid rgba(22,163,74,0.35)',
                              backdropFilter: 'blur(8px)',
                            }
                          : { border: '1px solid transparent' }
                      }
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? 'bg-green-600/40' : 'bg-white/5'
                        }`}
                      >
                        {isLive ? (
                          <Radio className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {coach.label}
                        </p>
                        <p className={`text-xs truncate ${isLive ? 'text-red-400' : 'text-gray-600'}`}>
                          {isLive ? 'Live now' : 'Not started'}
                        </p>
                      </div>
                      {isLive && (
                        <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeCoach && (
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="relative bg-black aspect-video w-full">
                  <VideoPlayer coach={activeCoach} />
                </div>
                <div
                  className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
                >
                  <div>
                    <h2 className="text-white font-bold text-lg">{activeCoach.label}</h2>
                    <p className="text-gray-400 text-sm">
                      {activeCoach.is_live && activeCoach.youtube_video_id
                        ? 'Stream is live'
                        : 'Waiting for stream to begin'}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-full px-4 py-1.5"
                    style={
                      activeCoach.is_live && activeCoach.youtube_video_id
                        ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {activeCoach.is_live && activeCoach.youtube_video_id ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                        <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Live</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Locked</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-10">
          ASMG 2026 &mdash; Kenyatta University, Nairobi &mdash; Members Only
        </p>
      </div>
    </div>
  );
}
