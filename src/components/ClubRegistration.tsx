import { useState } from 'react';
import { Building2, Phone, CreditCard, ChevronRight, CheckCircle, AlertCircle, Dumbbell, ScrollText, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SPORTS = [
  'Martial Arts',
  'Classical Ballet',
  'Modern Dance',
  'Athletics',
  'Swimming',
  'Football',
  'Basketball',
  'Volleyball',
  'Other',
];

interface FormState {
  club_name: string;
  email: string;
  primary_sport: string;
  phone_number: string;
  mpesa_code: string;
}

const EMPTY_FORM: FormState = {
  club_name: '',
  email: '',
  primary_sport: '',
  phone_number: '',
  mpesa_code: '',
};

export default function ClubRegistration() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.club_name.trim() || !form.primary_sport || !form.phone_number.trim() || !form.mpesa_code.trim()) {
      setError('Please fill in all fields before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const { error: dbError } = await supabase.from('club_registrations').insert({
      club_name: form.club_name.trim(),
      email: form.email.trim() || null,
      primary_sport: form.primary_sport,
      phone_number: form.phone_number.trim(),
      mpesa_code: form.mpesa_code.trim(),
    });

    if (dbError) {
      setSubmitting(false);
      setError('Submission failed. Please try again.');
      return;
    }

    try {
      const formspreeData = new FormData();
      formspreeData.append('Coach / Club Name', form.club_name.trim());
      formspreeData.append('Email', form.email.trim());
      formspreeData.append('Primary Sport', form.primary_sport);
      formspreeData.append('Phone Number', form.phone_number.trim());
      formspreeData.append('M-Pesa Transaction Code', form.mpesa_code.trim().toUpperCase());
      formspreeData.append('Liability Waiver Accepted', 'Yes');
      formspreeData.append('_subject', `New Club Registration: ${form.club_name.trim()} - ${form.primary_sport}`);

      await fetch('https://formspree.io/f/xpwrqgkd', {
        method: 'POST',
        body: formspreeData,
        headers: { Accept: 'application/json' },
      });
    } catch (_) {
    }

    if (form.email.trim()) {
      fetch(`${SUPABASE_URL}/functions/v1/send-contact-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email: form.email.trim() }),
      }).catch(() => {});
    }

    setSubmitting(false);
    setSuccess(true);
    setForm(EMPTY_FORM);
    setWaiverAccepted(false);
  }

  return (
    <section id="club-registration" className="py-20 bg-amber-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-amber-200">
            <Building2 className="w-3.5 h-3.5" />
            Partner Registration
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Register Your Club or Team
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Coaches and Club owners, register here to affiliate with the Modern African Sports Federation and organize official sanctioned events.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-amber-100 text-xs font-semibold uppercase tracking-widest">Affiliation Fee</div>
                  <div className="text-white text-2xl font-bold">Sh 1,500</div>
                </div>
              </div>
              <div className="bg-white/15 rounded-xl px-5 py-3 border border-white/20">
                <div className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-0.5">Pay via M-Pesa Till</div>
                <div className="text-white text-xl font-bold tracking-wider">4466212</div>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-amber-50 border-b border-amber-100">
            <p className="text-base font-bold text-amber-900">
              Pay Sh 1,500 to Buy Goods Till Number 4466212 to complete your registration.
            </p>
            <p className="text-sm text-amber-700 mt-1">
              After paying via M-Pesa, enter your transaction code in the form below.
            </p>
          </div>

          {success ? (
            <div className="p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Registration Submitted!</h3>
              <p className="text-gray-500 max-w-sm">
                Your club registration has been received. We will verify your payment and contact you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2"
              >
                Submit another registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Coach / Club Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="club_name"
                    value={form.club_name}
                    onChange={handleChange}
                    placeholder="e.g. Nairobi Elite Martial Arts Club"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(for confirmation)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. coach@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Primary Sport
                </label>
                <div className="relative">
                  <Dumbbell className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="primary_sport"
                    value={form.primary_sport}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition appearance-none bg-white"
                  >
                    <option value="">Select a sport</option>
                    {SPORTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="e.g. 0712 345 678"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  M-Pesa Transaction Code
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="mpesa_code"
                    value={form.mpesa_code}
                    onChange={handleChange}
                    placeholder="e.g. RBX4K29Z1A"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition uppercase"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                  <ScrollText className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Liability &amp; Media Release</span>
                  <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5">Required</span>
                </div>
                <div className="h-36 overflow-y-auto px-5 py-4 bg-white text-sm text-gray-700 leading-relaxed">
                  <p className="mb-3">By registering, the Club/Coach agrees that:</p>
                  <p className="mb-3">
                    <span className="font-bold text-gray-900">(A)</span> The African Sports Mini Games may take photos and videos of participants for live streaming and promotion.
                  </p>
                  <p className="mb-3">
                    <span className="font-bold text-gray-900">(B)</span> Sports involve risks, and the organizers are not liable for any accidental injury or loss at Kenyatta University.
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">(C)</span> You agree not to sue the organizers for such occurrences.
                  </p>
                </div>
                <div className={`px-5 py-4 border-t-2 ${waiverAccepted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'} transition-colors`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waiverAccepted}
                      onChange={e => setWaiverAccepted(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-amber-500 flex-shrink-0 cursor-pointer"
                      required
                    />
                    <span className={`text-sm font-semibold ${waiverAccepted ? 'text-green-800' : 'text-gray-700'} transition-colors`}>
                      I have read and agree to the Liability Waiver and Media Release.
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !waiverAccepted}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
              >
                {submitting ? 'Submitting...' : (
                  <>
                    Submit Registration
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
