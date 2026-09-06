import { Calendar, MapPin, Clock, UserCheck, Trophy, Star, Music, Award } from 'lucide-react';
import PosterGrid from './PosterGrid';

const EVENT_DATE = 'July 25, 2026';
const VENUE = 'Kenyatta University Main Campus';

interface ScheduleItem {
  time: string;
  label: string;
  description: string;
  icon: React.ElementType;
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  labelColor: string;
  dotColor: string;
  concurrent?: boolean;
}

const schedule: ScheduleItem[] = [
  {
    time: '8:00 AM – 9:00 AM',
    label: 'Registration',
    description: 'Check-in and collect participant materials',
    icon: UserCheck,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    labelColor: 'text-blue-700',
    dotColor: 'border-blue-500',
  },
  {
    time: '9:00 AM – 12:00 PM',
    label: 'Martial Arts Competition',
    description: 'Point Sparring, Kata, and Power Breaking',
    icon: Trophy,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    labelColor: 'text-red-700',
    dotColor: 'border-red-500',
    concurrent: true,
  },
  {
    time: '9:00 AM – 12:00 PM',
    label: 'Classical Ballet Evaluations',
    description: 'Traditional performances',
    icon: Star,
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    labelColor: 'text-pink-700',
    dotColor: 'border-pink-500',
    concurrent: true,
  },
  {
    time: '9:00 AM – 12:00 PM',
    label: 'Modern Dance Competitions',
    description: 'Contemporary categories',
    icon: Music,
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    labelColor: 'text-orange-700',
    dotColor: 'border-orange-500',
    concurrent: true,
  },
  {
    time: '12:00 PM – 1:00 PM',
    label: 'Award Ceremony',
    description: 'Presentation of medals and certificates',
    icon: Award,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    labelColor: 'text-green-700',
    dotColor: 'border-green-500',
  },
];

export default function Events() {
  return (
    <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Event Schedule
          </h2>
          <p className="text-xl text-gray-500">
            One day of discipline, artistry and competition
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white opacity-90 flex-shrink-0" />
                <div>
                  <div className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Date</div>
                  <div className="text-white text-xl font-bold">{EVENT_DATE}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-white opacity-90 flex-shrink-0" />
                <div>
                  <div className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Venue</div>
                  <div className="text-white text-lg font-semibold">{VENUE}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="relative">
              <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />

              <div className="space-y-5">
                {schedule.map((item, index) => {
                  const Icon = item.icon;
                  const showConcurrentLabel = item.concurrent && (index === 0 || !schedule[index - 1].concurrent);
                  return (
                    <div key={index}>
                      {showConcurrentLabel && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                          <div className="sm:w-[7.5rem] flex-shrink-0" />
                          <div className="flex-1 sm:pl-8">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              Concurrent events — 9:00 AM to 12:00 PM
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="sm:w-[7.5rem] flex-shrink-0 flex items-center sm:justify-end sm:pr-8 gap-2 sm:gap-0">
                          {!item.concurrent && (
                            <div className={`hidden sm:block absolute left-[7rem] w-4 h-4 rounded-full bg-white border-2 ${item.dotColor} top-4`} />
                          )}
                          {item.concurrent && (
                            <div className={`hidden sm:block absolute left-[7rem] w-3 h-3 rounded-full bg-white border-2 ${item.dotColor} top-5`} />
                          )}
                          <div className="flex items-center gap-1.5 sm:flex-col sm:items-end">
                            <Clock className="w-3.5 h-3.5 text-gray-400 sm:hidden" />
                            {!item.concurrent && (
                              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">{item.time}</span>
                            )}
                          </div>
                        </div>

                        <div className={`flex-1 rounded-xl border p-5 ${item.bg} ${item.border} transition-shadow hover:shadow-md`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                              <Icon className={`w-5 h-5 ${item.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`text-base font-bold ${item.labelColor}`}>{item.label}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-500">
                Participants are encouraged to arrive early for registration.
              </p>
              <a
                href="/MASF_Mini_Games_Schedule.pdf"
                download="MASF_Mini_Games_Schedule.pdf"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Download Schedule
              </a>
            </div>
          </div>
        </div>

        <PosterGrid />
      </div>
    </section>
  );
}
