import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <img
                  src="/African_Sports_Mini_Games_logo.png"
                  alt="African Sports Mini Games Logo"
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Uniting Africa's youth through sports, discipline, and excellence.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#sports" className="text-gray-400 hover:text-green-400 transition-colors">
                  Sports Categories
                </a>
              </li>
              <li>
                <a href="#events" className="text-gray-400 hover:text-green-400 transition-colors">
                  Events Schedule
                </a>
              </li>
              <li>
                <a href="#register" className="text-gray-400 hover:text-green-400 transition-colors">
                  Register Now
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Rules & Regulations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Downloads
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-4">
              Follow us for updates and highlights
            </p>
            <div className="flex space-x-3 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-green-400" />
              <a href="mailto:info@asmgafrica.com" className="text-gray-400 hover:text-green-400">
                info@asmgafrica.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {currentYear} African Sports Mini Games. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            Organized by KKF, Kumbo, Tawi Global, ILSKF
          </p>
        </div>
      </div>
    </footer>
  );
}
