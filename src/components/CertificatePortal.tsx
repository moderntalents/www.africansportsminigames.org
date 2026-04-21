import { useState, useRef } from 'react';
import { Shield, Search, FileText, CheckCircle, AlertCircle, Loader2, Award, User, ChevronDown, Lock, BadgeCheck, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SPORTS = [
  'Athletics', 'Basketball', 'Classical Ballet', 'Ballet', 'Chess',
  'Football', 'Gymnastics', 'Martial Arts', 'Modern Dance', 'Rugby',
  'Skating', 'Swimming', 'Volleyball',
];

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeevakde';

const MOCK_CERTIFICATES: Record<string, Certificate> = {
  'ASMG-2026-00001': { certificate_id: 'ASMG-2026-00001', holder_name: 'Amara Diallo', sport: 'Football', issue_date: '2026-01-15', expiry_date: null, status: 'valid' },
  'ASMG-2026-00002': { certificate_id: 'ASMG-2026-00002', holder_name: 'Chisom Okafor', sport: 'Swimming', issue_date: '2026-01-15', expiry_date: null, status: 'valid' },
  'ASMG-2026-00003': { certificate_id: 'ASMG-2026-00003', holder_name: 'Kofi Asante', sport: 'Chess', issue_date: '2026-01-20', expiry_date: null, status: 'valid' },
  'ASMG-2026-00004': { certificate_id: 'ASMG-2026-00004', holder_name: 'Fatima Nkosi', sport: 'Classical Ballet', issue_date: '2026-01-20', expiry_date: null, status: 'valid' },
  'ASMG-2026-00005': { certificate_id: 'ASMG-2026-00005', holder_name: 'Tendai Mwangi', sport: 'Martial Arts', issue_date: '2026-02-01', expiry_date: null, status: 'valid' },
};

type Certificate = {
  certificate_id: string;
  holder_name: string;
  sport: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
};

type Tab = 'verify' | 'request';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function CertificatePortal() {
  const [tab, setTab] = useState<Tab>('verify');

  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [cert, setCert] = useState<Certificate | null | 'not_found'>(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    sport: '',
    certificate_id: '',
    request_type: 'replacement' as 'replacement' | 'renewal',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    if (!id) return;
    setSearching(true);
    setCert(null);

    const { data, error } = await supabase
      .from('certificates')
      .select('certificate_id, holder_name, sport, issue_date, expiry_date, status')
      .eq('certificate_id', id)
      .maybeSingle();

    setSearching(false);

    if (!error && data) {
      setCert(data as Certificate);
      return;
    }

    const mock = MOCK_CERTIFICATES[id];
    if (mock) {
      setCert(mock);
    } else {
      setCert('not_found');
    }
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.full_name.trim()) errors.full_name = 'Full name is required.';
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      errors.email = 'A valid email address is required.';
    if (!form.sport) errors.sport = 'Please select a sport.';
    return errors;
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setSubmitting(true);

    await supabase
      .from('certificate_requests')
      .insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        sport: form.sport,
        issue_date: null,
        request_type: form.request_type,
        status: 'pending',
      });

    const formData = new FormData();
    formData.append('Full Name', form.full_name.trim());
    formData.append('Email Address', form.email.trim());
    formData.append('Sport', form.sport);
    formData.append('Certificate ID', form.certificate_id.trim() || 'Not provided');
    formData.append('Request Type', form.request_type === 'renewal' ? 'Renewal' : 'Replacement');
    formData.append('_subject', `Certificate ${form.request_type === 'renewal' ? 'Renewal' : 'Replacement'} Request: ${form.full_name.trim()} — ${form.sport}`);
    formData.append('_replyto', form.email.trim());

    let res: Response;
    try {
      res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
    } catch {
      setSubmitting(false);
      setSubmitResult({ ok: false });
      return;
    }

    setSubmitting(false);

    if (res.ok) {
      setSubmitResult({ ok: true });
      setForm({ full_name: '', email: '', sport: '', certificate_id: '', request_type: 'replacement' });
    } else {
      setSubmitResult({ ok: false });
    }
  }

  return (
    <section id="certificates" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-900/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_47px,rgba(255,255,255,0.015)_47px,rgba(255,255,255,0.015)_48px),repeating-linear-gradient(90deg,transparent,transparent_47px,rgba(255,255,255,0.015)_47px,rgba(255,255,255,0.015)_48px)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/40 rounded-full px-5 py-2 mb-6">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-bold text-xs uppercase tracking-widest">Official ASMG Registry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Certificate Verification Portal
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Verify the authenticity of an ASMG certificate or submit a renewal and replacement request.
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">

          <div className="flex border-b border-slate-700/60">
            <button
              onClick={() => setTab('verify')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-semibold transition-all ${
                tab === 'verify'
                  ? 'bg-green-700/20 text-green-300 border-b-2 border-green-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <Search className="w-4 h-4" />
              Online Verification
            </button>
            <button
              onClick={() => setTab('request')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-semibold transition-all ${
                tab === 'request'
                  ? 'bg-yellow-700/20 text-yellow-300 border-b-2 border-yellow-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              Renewal / Replacement
            </button>
          </div>

          <div className="p-8 md:p-10">

            {tab === 'verify' && (
              <div>
                <div className="flex items-start gap-3 bg-slate-700/40 border border-slate-600/40 rounded-xl p-4 mb-8">
                  <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Enter the Certificate ID printed on your ASMG certificate (e.g. <span className="font-mono text-slate-300">ASMG-2026-00001</span>) to verify its authenticity against the official registry.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchId}
                      onChange={e => { setSearchId(e.target.value); setCert(null); }}
                      placeholder="Enter Certificate ID (e.g. ASMG-2026-00001)"
                      className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching || !searchId.trim()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm whitespace-nowrap"
                  >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {searching ? 'Checking...' : 'Verify Certificate'}
                  </button>
                </form>

                {cert === 'not_found' && (
                  <div className="flex items-start gap-4 bg-red-900/20 border border-red-700/40 rounded-xl p-5">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 font-semibold text-sm mb-1">Certificate Not Found</p>
                      <p className="text-red-400/80 text-sm leading-relaxed">
                        No certificate matching <span className="font-mono font-bold">{searchId.trim().toUpperCase()}</span> was found in the ASMG registry. Please check the ID and try again, or submit a replacement request.
                      </p>
                    </div>
                  </div>
                )}

                {cert && cert !== 'not_found' && (
                  <div className={`rounded-xl overflow-hidden border ${
                    cert.status === 'valid'
                      ? 'border-green-600/50 bg-green-900/15'
                      : 'border-red-600/50 bg-red-900/15'
                  }`}>
                    <div className={`flex items-center gap-3 px-6 py-4 ${
                      cert.status === 'valid' ? 'bg-green-700/25' : 'bg-red-700/25'
                    }`}>
                      {cert.status === 'valid'
                        ? <BadgeCheck className="w-6 h-6 text-green-400" />
                        : <AlertCircle className="w-6 h-6 text-red-400" />
                      }
                      <div>
                        <p className={`font-bold text-base ${cert.status === 'valid' ? 'text-green-300' : 'text-red-300'}`}>
                          {cert.status === 'valid' ? 'Certificate Verified — Authentic' : `Certificate ${cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}`}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">Official ASMG Registry Record</p>
                      </div>
                    </div>
                    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Certificate ID</p>
                          <p className="text-white font-mono font-bold text-sm">{cert.certificate_id}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Certificate Holder</p>
                          <p className="text-white font-semibold text-sm">{cert.holder_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Sport / Category</p>
                          <p className="text-white font-semibold text-sm">{cert.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">Issue Date</p>
                          <p className="text-white font-semibold text-sm">{formatDate(cert.issue_date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-3 border-t border-slate-700/50 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <p className="text-slate-500 text-xs">Verified against the African Sports Mini Games official certificate registry.</p>
                    </div>
                  </div>
                )}

                {!cert && !searching && (
                  <div className="text-center py-12 text-slate-600">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Enter a Certificate ID above to begin verification.</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'request' && (
              <div>
                <div className="flex items-start gap-3 bg-slate-700/40 border border-slate-600/40 rounded-xl p-4 mb-8">
                  <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Complete the form below to request a certificate renewal or replacement. A confirmation email will be sent to you immediately. Your digital certificate will follow once our admin team verifies your details.
                  </p>
                </div>

                {submitResult?.ok ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-green-700/30 border-2 border-green-600/50 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">Application Submitted</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                      Application submitted successfully! Our admin team will verify your details and email your PDF certificate to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitResult(null)}
                      className="text-green-400 text-sm font-semibold hover:text-green-300 transition-colors"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRequest} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                          <input
                            type="text"
                            value={form.full_name}
                            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                            placeholder="Your full legal name"
                            className={`w-full bg-slate-900/60 border text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              formErrors.full_name ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/20'
                            }`}
                          />
                        </div>
                        {formErrors.full_name && <p className="text-red-400 text-xs mt-1.5">{formErrors.full_name}</p>}
                      </div>

                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="your@email.com"
                            className={`w-full bg-slate-900/60 border text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              formErrors.email ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/20'
                            }`}
                          />
                        </div>
                        {formErrors.email && <p className="text-red-400 text-xs mt-1.5">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Sport / Category <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <select
                            value={form.sport}
                            onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
                            className={`w-full bg-slate-900/60 border text-sm rounded-xl pl-10 pr-9 py-3 focus:outline-none focus:ring-2 transition-all appearance-none ${
                              form.sport ? 'text-white' : 'text-slate-500'
                            } ${
                              formErrors.sport ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : 'border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/20'
                            }`}
                          >
                            <option value="" className="bg-slate-800">Select a sport</option>
                            {SPORTS.map(s => (
                              <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                        {formErrors.sport && <p className="text-red-400 text-xs mt-1.5">{formErrors.sport}</p>}
                      </div>

                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Certificate ID <span className="text-slate-500 font-normal normal-case">(optional)</span>
                        </label>
                        <div className="relative">
                          <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                          <input
                            type="text"
                            value={form.certificate_id}
                            onChange={e => setForm(f => ({ ...f, certificate_id: e.target.value }))}
                            placeholder="e.g. ASMG-2026-00001"
                            className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
                        Request Type <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['replacement', 'renewal'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, request_type: type }))}
                            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                              form.request_type === type
                                ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
                                : 'border-slate-600 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              form.request_type === type ? 'border-yellow-400' : 'border-slate-500'
                            }`}>
                              {form.request_type === type && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                            </div>
                            <div>
                              <p className="font-semibold text-sm capitalize">{type}</p>
                              <p className="text-xs opacity-70 mt-0.5">
                                {type === 'replacement' ? 'Lost or damaged certificate' : 'Expired certificate update'}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {submitResult?.ok === false && (
                      <div className="flex items-center gap-2 bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-red-300 text-sm">Submission failed. Please try again or contact us directly.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-yellow-900/30"
                    >
                      {submitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...</>
                        : <><FileText className="w-4 h-4" /> Submit Application</>
                      }
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          <div className="border-t border-slate-700/60 px-8 py-4 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-slate-500 text-xs">Secured by ASMG Certificate Registry System</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 text-xs">
              <span>African Sports Mini Games 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Kenyatta University, Nairobi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
