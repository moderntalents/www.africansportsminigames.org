import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import AffiliatedMembers from './components/AffiliatedMembers';
import LearnMore from './components/LearnMore';
import SportsCategories from './components/SportsCategories';
import FeaturedGames from './components/FeaturedGames';
import Events from './components/Events';
import Gallery from './components/Gallery';
import LiveGate from './components/LiveGate';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MemberStream from './components/MemberStream';
import AdminApp from './admin/AdminApp';
import RegistrationForm from './components/RegistrationForm';
import CertificatePortal from './components/CertificatePortal';

const MEMBER_PATH = '/asmg-member-stream-2026';
const ADMIN_PATH = '/asmg-admin';
const ADMIN_GALLERY_PATH = '/admin-gallery';
const ADMIN_SHORT_PATH = '/admin';

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function App() {
  const path = usePath();

  if (path === MEMBER_PATH) {
    return <MemberStream />;
  }

  if (path === ADMIN_PATH || path === ADMIN_GALLERY_PATH || path === ADMIN_SHORT_PATH) {
    return <AdminApp />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <FeaturedGames />
      <About />
      <SportsCategories />
      <Events />
      <Gallery />
      <LiveGate />
      <RegistrationForm />
      <CertificatePortal />
      <Contact />
      <AffiliatedMembers />
      <LearnMore />
      <Footer />
    </div>
  );
}

export default App;
