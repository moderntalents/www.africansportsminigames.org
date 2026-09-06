import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, Plus, FileText, Image as ImageIcon, X } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeevakde';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function generateTicketId() {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `ASMG-${digits}`;
}

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showAttachMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  function handleDocPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAttachment(file);
    setShowAttachMenu(false);
    e.target.value = '';
  }

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAttachment(file);
    setShowAttachMenu(false);
    e.target.value = '';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = e.currentTarget;
    const data = new FormData(form);
    const newTicketId = generateTicketId();
    data.append('ticket_id', newTicketId);
    if (attachment) {
      data.append('attachment', attachment, attachment.name);
    }

    const userEmail = (data.get('email') as string) || '';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        setAttachment(null);
        setTicketId(newTicketId);
        setSubmitted(true);

        if (userEmail) {
          fetch(`${SUPABASE_URL}/functions/v1/send-contact-receipt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ email: userEmail }),
          }).catch(() => {});
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@asmgafrica.com</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">0722 524 438</div>
                    <div className="text-gray-600">0712 860 513</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">WhatsApp</div>
                    <div className="text-gray-600">0784 552 793</div>
                    <a
                      href="https://wa.me/254784552793"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Office Location</div>
                    <div className="text-gray-600">
                      Nairobi, Kenya
                      <br />
                      East Africa
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Office Hours</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold">8:00 AM - 12:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center text-center py-8 space-y-5">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Message Received!</h4>
                  <p className="text-gray-600 leading-relaxed max-w-sm">
                    Thank you! Your inquiry has been received. Our team will get back to you shortly at the email address provided.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 w-full">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Your Ticket ID is</p>
                  <p className="text-2xl font-bold text-green-700 tracking-wide">{ticketId}</p>
                </div>
                <p className="text-xs text-gray-500">Please save this for your records.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="full-name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 pb-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your message..."
                    />
                    <div className="absolute bottom-2 left-2" ref={menuRef}>
                      <button
                        type="button"
                        onClick={() => setShowAttachMenu(prev => !prev)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Attach file"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {showAttachMenu && (
                        <div className="absolute bottom-9 left-0 bg-white rounded-xl shadow-xl border border-gray-200 py-1 w-48 z-10 animate-fade-in">
                          <button
                            type="button"
                            onClick={() => docInputRef.current?.click()}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors text-left"
                          >
                            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                            Attach Document
                          </button>
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors text-left"
                          >
                            <ImageIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                            Attach Photo
                          </button>
                        </div>
                      )}

                      <input
                        ref={docInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleDocPick}
                      />
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={handlePhotoPick}
                      />
                    </div>
                  </div>

                  {attachment && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full pl-3 pr-1.5 py-1">
                      {attachment.type.startsWith('image/') ? (
                        <ImageIcon className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium text-green-800 max-w-[200px] truncate">
                        {attachment.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-green-200 text-green-600 transition-colors flex-shrink-0"
                        aria-label="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
