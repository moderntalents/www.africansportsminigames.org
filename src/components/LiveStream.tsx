import { Radio, Tv } from 'lucide-react';

const streams = [
  { label: 'Field 1', category: 'Football' },
  { label: 'Mat 1', category: 'Martial Arts' },
  { label: 'Pool 1', category: 'Swimming' },
  { label: 'Court 1', category: 'Basketball' },
  { label: 'Track 1', category: 'Athletics' },
  { label: 'Stage A', category: 'Ballet' },
  { label: 'Stage B', category: 'Modern Dance' },
  { label: 'Pitch 1', category: 'Rugby' },
  { label: 'Table 1', category: 'Chess' },
  { label: 'Floor 1', category: 'Gymnastics' },
];

export default function LiveStream() {
  return (
    <section id="live" className="py-20 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-5 py-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
            <span className="text-red-300 font-bold text-sm uppercase tracking-widest">ASMG Live Broadcast</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            ASMG Live: July 25th, 2026
          </h2>
          <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-8 py-4 mb-10">
            <p className="text-gray-200 text-base md:text-lg font-medium leading-relaxed">
              Broadcasting <span className="text-green-400 font-bold">10 categories</span> live from{' '}
              <span className="text-white font-bold">Kenyatta University</span>.<br className="hidden sm:block" />
              The stream will begin at <span className="text-white font-bold">8:00 AM</span>.
            </p>
          </div>

          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video max-w-4xl mx-auto">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-green-950">
              <div className="w-20 h-20 rounded-full bg-green-800/50 border border-green-600/40 flex items-center justify-center mb-5">
                <Tv className="w-9 h-9 text-green-400" />
              </div>
              <p className="text-white font-bold text-xl mb-1">Main Broadcast</p>
              <p className="text-gray-400 text-sm mb-6">Live stream begins July 25th at 8:00 AM</p>
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>
                <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Stream Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-center text-white font-bold text-xl mb-6 uppercase tracking-widest opacity-70">
            Category Streams
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {streams.map((stream) => (
              <div
                key={stream.label}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-green-500/40 hover:bg-white/8 transition-all duration-300"
              >
                <div className="relative bg-black aspect-video w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-green-950/80">
                    <Radio className="w-8 h-8 text-green-500 mb-2 opacity-60" />
                    <span className="text-green-300 font-semibold text-sm uppercase tracking-wider">Coming Soon</span>
                    <span className="text-gray-500 text-xs mt-1">Stream starts July 25th at 8:00 AM</span>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-base">{stream.category}</div>
                    <div className="text-green-400 text-sm font-medium mt-0.5">{stream.label}</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-600/15 border border-red-500/25 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
                    <span className="text-red-300 text-xs font-semibold uppercase tracking-wide">Live Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
