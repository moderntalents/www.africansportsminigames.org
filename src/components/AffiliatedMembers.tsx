import { Handshake, ChevronDown } from 'lucide-react';

function scrollToLearnMore() {
  const el = document.getElementById('learn-more');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const ORGS = [
  { name: 'International Luelmo Kenpo Studios Federation', abbr: 'ILKSF', logo: '/WhatsApp_Image_2026-04-08_at_19.38.24.jpeg', bg: 'bg-gray-900' },
  { name: 'Kumbo Africana Combat Kenya', abbr: 'Kumbo', logo: '/WhatsApp_Image_2026-04-08_at_22.28.22.jpeg', bg: 'bg-white' },
  { name: 'Kenya Kenpo Federation', abbr: 'KKF', logo: '/image.png', bg: 'bg-yellow-400' },
  { name: 'Tawi Global Enrichment', abbr: 'Tawi Global', logo: '/Circular_Emblem_for_Co-Curricular_Activities.png', bg: 'bg-white' },
];

export default function AffiliatedMembers() {
  return (
    <section id="affiliated-members" className="py-20 bg-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/30">
            <Handshake className="w-3.5 h-3.5" />
            Official Partners
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Organized by KKF, Kumbo, ILKSF &amp; Tawi Global
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Proud organizations partnering with the Modern African Sports Federation to deliver world-class sanctioned events across Africa.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {ORGS.map((org) => (
            <div
              key={org.abbr}
              className="rounded-2xl border-2 border-white/30 hover:border-white flex flex-col items-center text-center shadow-md hover:shadow-2xl transition-all group overflow-hidden bg-white"
            >
              <div className={`w-full flex items-center justify-center p-4 ${org.bg}`} style={{ height: '160px' }}>
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="px-3 py-3 bg-white w-full">
                <div className="text-sm font-black text-gray-800 mb-0.5">{org.abbr}</div>
                <div className="text-xs text-gray-500 leading-snug">{org.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={scrollToLearnMore}
            className="inline-flex items-center gap-2 bg-white hover:bg-green-50 active:scale-95 text-green-700 font-bold px-7 py-3.5 rounded-xl text-sm border-2 border-white/60 hover:border-white transition-all shadow-md"
          >
            Learn More
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
