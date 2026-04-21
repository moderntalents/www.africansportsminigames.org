import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date('2026-07-25T08:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
          <p className="text-green-800 font-semibold text-sm">
            Continental Youth Sports Championship 2026
          </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          African Sports
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
            Mini Games
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Uniting Africa's youth through sport, discipline, and excellence.
          Join thousands of young athletes in celebrating talent across the continent.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#register"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg inline-block text-center"
          >
            Register Now
          </a>
          <a
            href="#learn-more"
            onClick={e => {
              e.preventDefault();
              document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all border-2 border-green-600 inline-block text-center"
          >
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {countdown.days}
            </div>
            <div className="text-gray-600 font-medium">Days</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {countdown.hours}
            </div>
            <div className="text-gray-600 font-medium">Hours</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {countdown.minutes}
            </div>
            <div className="text-gray-600 font-medium">Minutes</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {countdown.seconds}
            </div>
            <div className="text-gray-600 font-medium">Seconds</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Calendar className="w-10 h-10 text-green-600 mb-3 mx-auto" />
            <h3 className="font-bold text-gray-900 mb-2">July 25, 2026</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <MapPin className="w-10 h-10 text-green-600 mb-3 mx-auto" />
            <h3 className="font-bold text-gray-900 mb-2">Kenyatta University Main Campus</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Users className="w-10 h-10 text-green-600 mb-3 mx-auto" />
            <h3 className="font-bold text-gray-900 mb-2">Open Registration</h3>
            <p className="text-gray-600 text-sm">Schools, clubs, and individuals welcome</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
