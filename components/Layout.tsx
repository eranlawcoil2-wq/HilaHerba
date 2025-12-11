import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, MessageCircle, Accessibility, Eye, Type, Minus } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import LegalModal, { LegalType } from './LegalModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Legal Modal State
  const [legalModalType, setLegalModalType] = useState<LegalType>(null);

  // Accessibility State
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

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
    <div className={`min-h-screen flex flex-col font-sans text-gray-800 bg-[#FAF9F6] transition-all duration-300 ${highContrast ? 'grayscale contrast-125' : ''} ${largeText ? 'text-lg' : ''}`}>
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
                className={`font-medium transition-colors hover:text-green-700 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-700 after:transition-all hover:after:w-full ${
                    location.pathname === item.path ? 'text-green-800 after:w-full' : 'text-gray-700'
                } ${largeText ? 'text-xl' : 'text-lg'}`}
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
      <footer className="bg-[#1a2e1a] text-white py-12 border-t border-green-800 relative z-30">
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
            <h4 className="text-lg font-bold mb-4 text-green-100">מדיניות ומידע</h4>
            <ul className="space-y-2">
                <li>
                    <button onClick={() => setLegalModalType('health')} className="text-gray-400 hover:text-white transition-colors text-sm hover:underline">
                        הצהרת בריאות
                    </button>
                </li>
                <li>
                    <button onClick={() => setLegalModalType('privacy')} className="text-gray-400 hover:text-white transition-colors text-sm hover:underline">
                        מדיניות פרטיות
                    </button>
                </li>
                <li>
                    <button onClick={() => setLegalModalType('terms')} className="text-gray-400 hover:text-white transition-colors text-sm hover:underline">
                        תנאי שימוש
                    </button>
                </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-green-900 text-gray-500 text-sm">
          © {new Date().getFullYear()} Herbal.co.il. כל הזכויות שמורות.
        </div>
      </footer>

      {/* Floating Buttons (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        
        {/* Accessibility Menu */}
        <AnimatePresence>
            {isAccessMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="mb-2 bg-white rounded-xl shadow-xl p-3 border border-gray-100 min-w-[160px]"
                >
                    <div className="space-y-2">
                        <button 
                            onClick={() => setLargeText(!largeText)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${largeText ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <Type size={16} /> הגדל טקסט
                        </button>
                        <button 
                            onClick={() => setHighContrast(!highContrast)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${highContrast ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <Eye size={16} /> ניגודיות גבוהה
                        </button>
                         <button 
                            onClick={() => {setLargeText(false); setHighContrast(false);}}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 border-t border-gray-100 mt-1"
                        >
                            <Minus size={16} /> איפוס
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <button 
            onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="נגישות"
        >
            <Accessibility size={24} />
        </button>

        {/* WhatsApp Button */}
        <a 
            href="https://wa.me/972501234567" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={24} />
        </a>
      </div>

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModalType && (
            <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Layout;