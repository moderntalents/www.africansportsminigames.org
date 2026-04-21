import { Target, Eye, Heart, Award, Trophy } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To unite African youth through sports, promoting physical fitness, discipline, and cultural exchange across the continent.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'A continent where every young athlete has the opportunity to compete, excel, and inspire the next generation.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Excellence, integrity, unity, and respect. We celebrate diversity while building bridges through shared passion for sports.',
    },
    {
      icon: Award,
      title: 'Our Impact',
      description: 'Creating pathways for youth development, talent discovery, and building champions both on and off the field.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About the Games
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building Africa's future through youth sports excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              A Continental Movement
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              The African Sports Mini Games is more than just a competition. It's a platform
              designed to discover, nurture, and celebrate young athletic talent across Africa.
              Founded with the vision of creating opportunities for youth development, we bring
              together schools, clubs, and individual athletes in a spirit of friendly competition
              and mutual growth.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Through disciplines ranging from martial arts to team sports, strategic games to
              athletic prowess, we provide a comprehensive platform for youth to showcase their
              abilities, learn from peers, and develop life skills that extend far beyond the
              playing field.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-green-600">10</div>
                <div className="text-sm text-gray-600 font-medium">Sports Categories</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600 font-medium">Expected Participants</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-green-600">10+</div>
                <div className="text-sm text-gray-600 font-medium">African Countries</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900">Coaching Excellence</h3>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all max-w-lg w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Honoring the Architects of Excellence
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                At the African Sports Mini Games, we don't just celebrate the athletes on the podium; we celebrate the mastery behind them. For every event, we are proud to recognize and award the Best Coach, honoring those who demonstrate exceptional leadership, technical strategy, and sportsmanship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
