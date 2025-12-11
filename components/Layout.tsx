import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-[#FAF9F6]">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
                <Leaf className={`w-8 h-8 ${isScrolled ? 'text-green-800' : 'text-green-900'} transition-colors`} />
                <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-70"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
            <span className={`text-2xl font-serif font-bold tracking-wide ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Herbal
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium transition-colors hover:text-green-700 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-700 after:transition-all hover:after:w-full ${
                    location.pathname === item.path ? 'text-green-800 after:w-full' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FAF9F6] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-2xl font-serif text-gray-800 hover:text-green-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2e1a] text-white py-12 border-t border-green-800">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-2xl font-serif mb-4 flex items-center justify-center md:justify-start gap-2">
               <Leaf className="text-green-400" size={20}/> Herbal
            </h3>
            <p className="text-gray-300 leading-relaxed">
              מרכז ידע וטיפול בצמחי מרפא.
              <br />
              מחברים את חוכמת העבר עם המדע של היום.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-green-100">קישורים מהירים</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-green-100">צור קשר</h4>
            <p className="text-gray-300">טלפון: 050-1234567</p>
            <p className="text-gray-300">מייל: info@herbal.co.il</p>
            <p className="text-gray-300">קליניקה: תל אביב</p>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-green-900 text-gray-500 text-sm">
          © {new Date().getFullYear()} Herbal.co.il. כל הזכויות שמורות.
        </div>
      </footer>
    </div>
  );
};

export default Layout;