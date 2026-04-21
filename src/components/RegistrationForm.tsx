import { useState } from 'react';
import { CheckCircle, AlertCircle, User, Mail, Dumbbell, Phone, ScrollText, ShieldCheck } from 'lucide-react';
import RulesModal from './RulesModal';

const SPORTS = [
  'Martial Arts',
  'Classical Ballet',
  'Modern Dance',
  'Athletics',
  'Swimming',
  'Football',
  'Basketball',
  'Volleyball',
  'Chess',
  'Other',
];

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeevakde';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function generateTicketId() {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `ASMG-${digits}`;
}

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [liabilityAgreed, setLiabilityAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const newTicketId = generateTicketId();
    data.append('ticket_id', newTicketId);

    const name = (data.get('name') as string) || '';
    const email = (data.get('email') as string) || '';
    const sport = (data.get('sport') as string) || '';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setTicketId(newTicketId);
        setSubmitted(true);
        form.reset();
        setLiabilityAgreed(false);

        fetch(`${SUPABASE_URL}/functions/v1/send-registration-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name, email, sport, ticket_id: newTicketId }),
        }).then(async r => {
          const body = await r.text();
          console.log('[RegistrationForm] Welcome email response:', r.status, body);
        }).catch(err => {
          console.error('[RegistrationForm] Welcome email network error:', err);
        });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = (json as { error?: string }).error || 'Submission failed. Please try again or contact us directly.';
        setError(msg);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section id="register" className="py-20 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-green-200 rounded-2xl p-12 text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Our team will reach out to confirm your spot shortly at the email address you provided.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Your Ticket ID is</p>
              <p className="text-2xl font-bold text-green-700 tracking-widest">{ticketId}</p>
            </div>
            <p className="text-xs text-gray-500 mb-8">Please save this for your records.</p>
            <button
              onClick={() => { setSubmitted(false); setTicketId(''); }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors text-sm"
            >
              Submit Another Registration
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 bg-gradient-to-br from-white to-green-50">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-green-200">
            Register Now
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Athlete Registration
          </h2>
          <p className="text-lg text-gray-500 mb-5">
            Complete your registration below. Registration is free.
          </p>
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-green-50 active:scale-95 text-green-700 font-semibold px-5 py-2.5 rounded-xl text-sm border border-green-200 hover:border-green-400 transition-all shadow-sm"
          >
            <ScrollText className="w-4 h-4" />
            View Official Rules &amp; Regulations
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Jane Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. jane@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. +254 712 345 678"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Sport</label>
            <div className="relative">
              <Dumbbell className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="sport"
                required
                defaultValue=""
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition appearance-none bg-white"
              >
                <option value="" disabled>Select a sport</option>
                {SPORTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 bg-gray-50 border-b border-gray-200 px-4 py-2.5">
              <ShieldCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Liability &amp; Media Release</span>
            </div>
            <div
              className="h-[120px] overflow-y-auto bg-gray-50 px-4 py-3 text-xs text-gray-600 leading-relaxed"
            >
              By registering, I acknowledge that I am entering an area where photos and videos are being taken for promotional purposes. I also agree that the African Sports Mini Games (ASMG) and Kenyatta University are not liable for any accidental injury or loss of property that may occur during the event.
            </div>
            <div className="bg-white px-4 py-3 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={liabilityAgreed}
                  onChange={e => setLiabilityAgreed(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0 cursor-pointer"
                />
                <span className="text-xs text-gray-700 font-medium leading-snug">
                  I have read and agree to the liability and media release terms.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !liabilityAgreed}
            onClick={() => console.log('Submit Registration button clicked')}
            className="relative z-10 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-md hover:shadow-green-200 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>

          <p className="text-center text-xs text-gray-400">
            Registration is free. Our team will reach out to confirm your spot.
          </p>
        </form>
      </div>
    </section>
  );
}
