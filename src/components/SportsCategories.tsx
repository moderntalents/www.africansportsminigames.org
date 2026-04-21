import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Sport {
  id: string;
  name: string;
  description: string;
  icon: string;
  registration_fee: number | null;
  july_event: boolean;
}

const sportImages: Record<string, string> = {
  'Martial Arts':      'https://images.pexels.com/photos/7045474/pexels-photo-7045474.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Classical Ballet':  'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Ballet':            'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Modern Dance':      'https://images.pexels.com/photos/5007381/pexels-photo-5007381.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Athletics':         'https://images.pexels.com/photos/21923389/pexels-photo-21923389.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Swimming':          'https://images.pexels.com/photos/2028018/pexels-photo-2028018.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Football':          'https://images.pexels.com/photos/19834318/pexels-photo-19834318.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Basketball':        'https://images.pexels.com/photos/15233592/pexels-photo-15233592.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Volleyball':        'https://images.pexels.com/photos/29352743/pexels-photo-29352743.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Chess':             'https://images.pexels.com/photos/6140943/pexels-photo-6140943.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Gymnastics':        'https://images.pexels.com/photos/3760275/pexels-photo-3760275.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Rugby':             'https://images.pexels.com/photos/8586344/pexels-photo-8586344.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Archery':           'https://images.pexels.com/photos/36375506/pexels-photo-36375506.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Skating':           'https://images.pexels.com/photos/5764956/pexels-photo-5764956.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const cardPalette = [
  { gradient: 'from-green-600 to-green-800', badge: 'bg-green-100 text-green-700', btn: 'from-green-600 to-green-700', border: 'hover:border-green-300' },
  { gradient: 'from-blue-600 to-blue-800', badge: 'bg-blue-100 text-blue-700', btn: 'from-blue-600 to-blue-700', border: 'hover:border-blue-300' },
  { gradient: 'from-teal-600 to-teal-800', badge: 'bg-teal-100 text-teal-700', btn: 'from-teal-600 to-teal-700', border: 'hover:border-teal-300' },
  { gradient: 'from-slate-600 to-slate-800', badge: 'bg-slate-100 text-slate-700', btn: 'from-slate-600 to-slate-700', border: 'hover:border-slate-300' },
  { gradient: 'from-cyan-600 to-cyan-800', badge: 'bg-cyan-100 text-cyan-700', btn: 'from-cyan-600 to-cyan-700', border: 'hover:border-cyan-300' },
  { gradient: 'from-emerald-600 to-emerald-800', badge: 'bg-emerald-100 text-emerald-700', btn: 'from-emerald-600 to-emerald-700', border: 'hover:border-emerald-300' },
  { gradient: 'from-sky-600 to-sky-800', badge: 'bg-sky-100 text-sky-700', btn: 'from-sky-600 to-sky-700', border: 'hover:border-sky-300' },
  { gradient: 'from-green-700 to-teal-700', badge: 'bg-green-100 text-green-700', btn: 'from-green-700 to-teal-700', border: 'hover:border-green-300' },
  { gradient: 'from-blue-700 to-cyan-700', badge: 'bg-blue-100 text-blue-700', btn: 'from-blue-700 to-cyan-700', border: 'hover:border-blue-300' },
  { gradient: 'from-teal-700 to-green-700', badge: 'bg-teal-100 text-teal-700', btn: 'from-teal-700 to-green-700', border: 'hover:border-teal-300' },
];

const JULY_EVENT_DATE = 'July 25th, 2026';
const JULY_EVENT_VENUE = 'Kenyatta University';

export default function SportsCategories() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSports() {
      const { data, error } = await supabase
        .from('sports_categories')
        .select('id, name, description, icon, registration_fee, july_event')
        .eq('is_active', true)
        .order('name');

      if (data && !error) setSports(data);
      setLoading(false);
    }
    fetchSports();
  }, []);

  return (
    <section id="sports" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sports Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compete in multiple disciplines and showcase your talent across various sports
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 max-w-2xl w-full text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>
              <span className="text-amber-700 font-bold text-sm uppercase tracking-wide">Next Event</span>
            </div>
            <p className="text-gray-900 font-bold text-lg">{JULY_EVENT_DATE} &mdash; {JULY_EVENT_VENUE}</p>
            <p className="text-gray-500 text-sm mt-1">
              Competing on this date: <span className="font-semibold text-gray-700">Martial Arts, Classical Ballet &amp; Modern Dance</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sports.map((sport, index) => {
              const style = cardPalette[index % cardPalette.length];
              const imgSrc = sportImages[sport.name];
              return (
                <div
                  key={sport.id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 ${style.border} flex flex-col`}
                >
                  <div className="relative h-44 overflow-hidden bg-gray-200">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={sport.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                        <Trophy className="w-12 h-12 text-white/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {sport.july_event && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
                        July 25
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-2">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{sport.name}</h3>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3">
                      {sport.description}
                    </p>

                    <a
                      href="#register"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold text-center transition-colors block"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
