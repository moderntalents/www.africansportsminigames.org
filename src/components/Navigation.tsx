export default function Navigation() {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Sports', href: '#sports' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#home" className="flex items-center">
            <img
              src="/African_Sports_Mini_Games_logo.png"
              alt="African Sports Mini Games Logo"
              className="h-14 w-auto object-contain"
            />
          </a>

          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#live"
              className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              Live
            </a>
            <a
              href="#register"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 inline-block"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
