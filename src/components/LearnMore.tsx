import { useState } from 'react';
import { Target, Users, Globe, Award, CalendarDays, ChevronRight, CheckCircle, Building2, Phone, CreditCard, AlertCircle, Dumbbell, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BENEFITS = [
  {
    icon: Award,
    title: 'Official Event Affiliation',
    desc: 'Get your club recognized as an official participant of the African Sports Mini Games.',
  },
  {
    icon: Users,
    title: 'Networking',
    desc: 'Connect and collaborate with leaders from KKF, Kumbo, and ILKSF.',
  },
  {
    icon: Globe,
    title: 'Future Hosting',
    desc: 'Eligibility to collaborate on future editions of the games.',
  },
  {
    icon: CheckCircle,
    title: 'Professional Recognition',
    desc: 'Access to official event resources and standardized competition protocols.',
  },
];

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
  primary_sport: string;
  phone_number: string;
  mpesa_code: string;
}

const EMPTY_FORM: FormState = {
  club_name: '',
  primary_sport: '',
  phone_number: '',
  mpesa_code: '',
};

export default function LearnMore() {
  const [showAffiliationForm, setShowAffiliationForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
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
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-registration-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            club_name: form.club_name.trim(),
            primary_sport: form.primary_sport,
            phone_number: form.phone_number.trim(),
            mpesa_code: form.mpesa_code.trim(),
          }),
        }
      );
    } catch (_) {
    }

    setSubmitting(false);
    setSuccess(true);
    setForm(EMPTY_FORM);
  }

  return (
    <section id="learn-more" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            About the African Sports Mini Games
          </h2>
          <div className="w-16 h-1 bg-green-500 rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-green-200">
              <Target className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To unify and elevate 10 key sports categories across Africa, creating a professional platform for youth to excel in martial arts, dance, chess, and swimming.
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-amber-200">
              <CalendarDays className="w-3.5 h-3.5" />
              The July 25th Vision
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Experience our mission in action at Kenyatta University as we host athletes and coaches from 10+ countries for a day of elite competition and cultural exchange.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border border-gray-200">
              <Award className="w-3.5 h-3.5" />
              Member Benefits &mdash; Sh 1,500
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              What You Get as an Official Member
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="flex gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{b.title}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAffiliationForm(prev => !prev)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-amber-200"
          >
            <Building2 className="w-5 h-5" />
            Get Officially Affiliated (Sh 1,500)
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAffiliationForm ? 'rotate-180' : ''}`} />
          </button>
          <p className="mt-3 text-sm text-gray-400">
            {showAffiliationForm ? 'Click above to hide the form' : 'Click to reveal the affiliation form'}
          </p>
        </div>

        {showAffiliationForm && (
          <div className="mt-2 animate-fade-in">
            <div className="max-w-3xl mx-auto">
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

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
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
          </div>
        )}

      </div>
    </section>
  );
}
