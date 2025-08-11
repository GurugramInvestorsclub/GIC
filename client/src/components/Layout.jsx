import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, activePage = 'home' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'About', href: '/about', id: 'about' },
    { name: 'Blog', href: '/blog', id: 'blog' },
    { name: 'Events', href: '/events', id: 'events' },
    { name: 'Forum', href: '/forum', id: 'forum' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavClick('/')}
                className="focus:outline-none focus:ring-0 hover:opacity-80 transition-opacity"
              >
                <img src="./Logo.png" alt="GIC Logo" className='w-[150px]'/>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
                    activePage === item.id
                      ? 'font-bold text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-black focus:outline-none focus:ring-0 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left px-3 py-2 text-lg transition-colors duration-200 focus:outline-none focus:ring-0 ${
                      activePage === item.id
                        ? 'font-bold text-black bg-gray-50'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 Gurugram Investors Club. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;  