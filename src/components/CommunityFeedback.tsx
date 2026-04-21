import { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function CommunityFeedback() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('community_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setError('Please fill in both your name and message.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: insertError } = await supabase
      .from('community_feedback')
      .insert({ name: trimmedName, message: trimmedMessage })
      .select()
      .single();

    if (insertError) {
      setError('Failed to post your comment. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (data) {
      setComments((prev) => [data, ...prev]);
    }

    setName('');
    setMessage('');
    setIsSubmitting(false);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <section id="community" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-100 rounded-full">
            <MessageCircle className="w-4 h-4 text-green-700" />
            <span className="text-green-800 font-semibold text-sm">Community Voice</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Feedback</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Share your thoughts, excitement, and support for the African Sports Mini Games 2026.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-green-600" />
            Leave a Comment
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="feedback-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Name
              </label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                maxLength={80}
              />
            </div>

            <div>
              <label htmlFor="feedback-message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts about the African Sports Mini Games..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/500</p>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'No comments yet'}
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(comment.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-gray-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-green-600" />
                          {comment.name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{comment.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
