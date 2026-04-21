import { Shield, Star, Music2, Trophy, Brain, Goal, Waves, Target, Zap, Circle } from 'lucide-react';

interface FeaturedGame {
  name: string;
  description: string;
  fee: number;
  icon: React.ElementType;
  highlight?: string;
  accentColor: string;
  iconBg: string;
}

const featuredGames: FeaturedGame[] = [
  {
    name: 'Football',
    description: '5-a-side and 7-a-side tournaments for all age categories. Fast-paced team competition.',
    fee: 600,
    icon: Goal,
    highlight: 'Most Popular',
    accentColor: 'border-green-500',
    iconBg: 'bg-green-600',
  },
  {
    name: 'Martial Arts',
    description: 'Discipline, focus, and self-defence through structured martial arts training and competition.',
    fee: 500,
    icon: Shield,
    highlight: 'July 25 Event',
    accentColor: 'border-amber-500',
    iconBg: 'bg-amber-600',
  },
  {
    name: 'Swimming',
    description: 'Freestyle, backstroke, breaststroke, and butterfly disciplines across age groups.',
    fee: 500,
    icon: Waves,
    accentColor: 'border-cyan-500',
    iconBg: 'bg-cyan-600',
  },
  {
    name: 'Rugby',
    description: 'Tag and contact rugby tournaments that build teamwork, strength and strategy.',
    fee: 550,
    icon: Trophy,
    accentColor: 'border-green-600',
    iconBg: 'bg-green-700',
  },
  {
    name: 'Athletics',
    description: 'Sprints, relays, long jump, and high jump. Track and field for all skill levels.',
    fee: 400,
    icon: Zap,
    accentColor: 'border-teal-500',
    iconBg: 'bg-teal-600',
  },
  {
    name: 'Chess',
    description: 'Rapid and blitz formats to sharpen your mind in strategic board game competition.',
    fee: 300,
    icon: Brain,
    accentColor: 'border-slate-500',
    iconBg: 'bg-slate-700',
  },
  {
    name: 'Archery',
    description: 'Recurve and compound bow events that test precision, breath control and focus.',
    fee: 450,
    icon: Target,
    accentColor: 'border-green-500',
    iconBg: 'bg-green-600',
  },
  {
    name: 'Gymnastics',
    description: 'Floor, beam, and vault events showcasing strength, flexibility, and balance.',
    fee: 500,
    icon: Star,
    accentColor: 'border-yellow-500',
    iconBg: 'bg-yellow-600',
  },
  {
    name: 'Modern Dance',
    description: 'Contemporary and modern dance showcase competitions celebrating creativity and movement.',
    fee: 400,
    icon: Music2,
    highlight: 'July 25 Event',
    accentColor: 'border-amber-500',
    iconBg: 'bg-amber-600',
  },
  {
    name: 'Skating',
    description: 'Speed skating and artistic roller skating performances across multiple categories.',
    fee: 450,
    icon: Circle,
    accentColor: 'border-cyan-500',
    iconBg: 'bg-cyan-700',
  },
];

export default function FeaturedGames() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-4 uppercase tracking-wide">
            2026 Programme
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Games
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose your sport, register your team or individual entry, and compete at Kenyatta University.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.name}
                className={`group relative bg-white rounded-2xl border-2 ${game.accentColor} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}
              >
                {game.highlight && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                      {game.highlight}
                    </span>
                  </div>
                )}

                <div className="p-6 pb-4">
                  <div className={`w-14 h-14 ${game.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{game.description}</p>
                </div>

                <div className="mt-auto px-6 pb-6 pt-2">
                  <a
                    href="#contact"
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-2.5 rounded-xl text-sm font-semibold text-center transition-colors block"
                  >
                    Register Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a href="#register" className="text-green-600 font-semibold hover:underline text-sm">
            View full registration form &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
