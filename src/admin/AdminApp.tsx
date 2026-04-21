import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminGallery from './AdminGallery';
import AdminPosters from './AdminPosters';
import AdminCoachStreams from './AdminCoachStreams';
import { LogOut, Images, FileImage, Radio, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { navigate } from '../App';

type Tab = 'gallery' | 'posters' | 'streams';

export default function AdminApp() {
  const [session, setSession] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('gallery');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  if (session === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={() => setSession(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900">ASMG Admin</span>
            </div>

            <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Images className="w-3.5 h-3.5" />
                Gallery
              </button>
              <button
                onClick={() => setActiveTab('posters')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'posters'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                Posters
              </button>
              <button
                onClick={() => setActiveTab('streams')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'streams'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Live Streams
              </button>
            </nav>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'gallery' && <AdminGallery />}
        {activeTab === 'posters' && <AdminPosters />}
        {activeTab === 'streams' && <AdminCoachStreams />}
      </main>
    </div>
  );
}
