import { X, ShieldCheck, Clock, Shirt, Users, Scale } from 'lucide-react';

const RULES = [
  {
    icon: ShieldCheck,
    color: 'bg-green-100 text-green-700',
    number: '01',
    title: 'Eligibility',
    body: 'Open to all youth athletes within the specified age brackets. Each participant must be registered under an affiliated club or coach.',
  },
  {
    icon: Clock,
    color: 'bg-blue-100 text-blue-700',
    number: '02',
    title: 'Check-in & Weigh-ins',
    body: 'All athletes must report to the Kenyatta University venue by 8:00 AM on July 25th for registration verification and necessary weigh-ins (for martial arts).',
  },
  {
    icon: Shirt,
    color: 'bg-amber-100 text-amber-700',
    number: '03',
    title: 'Equipment & Attire',
    body: 'Participants must wear the official uniform of their sport (e.g., Gi for Martial Arts, dance attire for Ballet). Safety gear is mandatory for all combat sports.',
  },
  {
    icon: Users,
    color: 'bg-red-100 text-red-700',
    number: '04',
    title: 'Code of Conduct',
    body: 'We maintain a zero-tolerance policy for unsportsmanlike behavior. Coaches are responsible for the conduct of their students and parents.',
  },
  {
    icon: Scale,
    color: 'bg-gray-100 text-gray-700',
    number: '05',
    title: 'Dispute Resolution',
    body: 'All referee and judge decisions are final. Technical protests must be filed within 30 minutes of the match/performance conclusion by the head coach.',
  },
];

interface RulesModalProps {
  onClose: () => void;
}

export default function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Rules &amp; Regulations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6 space-y-5">
          {RULES.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.number}
                className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-300 tabular-nums">{rule.number}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5 text-base">{rule.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rule.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            African Sports Mini Games &mdash; Kenyatta University, July 25th &mdash; Decisions by event officials are final.
          </p>
        </div>
      </div>
    </div>
  );
}
