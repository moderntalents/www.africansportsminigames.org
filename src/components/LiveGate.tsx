import { Lock, MessageCircle, Shield } from 'lucide-react';

const SPORTS = [
  { name: 'Martial Arts', img: '/493739762_1173009698169755_2885288246390870509_n_(1).jpg' },
  { name: 'Classical Ballet', img: '/159dbe2a4eb427d27d9d07db30fccd18.jpg' },
  { name: 'Modern Dance', img: 'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Athletics', img: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Swimming', img: 'https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Football', img: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Basketball', img: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Volleyball', img: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Chess', img: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Gymnastics', img: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export default function LiveGate() {
  return (
    <div id="live" className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-5 py-2 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
            <span className="text-red-300 font-bold text-sm uppercase tracking-widest">ASMG Live Broadcast</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            ASMG Private Broadcast
          </h1>

          <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl px-8 py-7 mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-green-700/40 border border-green-500/40 flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-300" />
              </div>
            </div>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-4">
              This live stream from{' '}
              <span className="text-white font-bold">Kenyatta University</span> is{' '}
              <span className="text-green-400 font-bold">exclusive to registered members and parents</span>.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              To watch, please use the{' '}
              <span className="text-white font-bold">private access link</span> shared in your official club{' '}
              <span className="text-green-400 font-bold">WhatsApp group</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-300">
              <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
              Members-only access
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-300">
              <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Check your club WhatsApp group for the link
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-center text-white/60 text-xs font-bold uppercase tracking-widest mb-6">
            10 Sports Broadcasting Live — July 25th, 2026
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SPORTS.map((sport) => (
              <div
                key={sport.name}
                className="group relative overflow-hidden rounded-xl aspect-square shadow-lg border border-white/10"
              >
                <img
                  src={sport.img}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-50"
                />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="text-white text-xs font-bold leading-tight drop-shadow-md">{sport.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-10">
          ASMG 2026 &mdash; Kenyatta University, Nairobi
        </p>
      </div>
    </div>
  );
}
