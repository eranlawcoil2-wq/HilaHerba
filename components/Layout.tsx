import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, MessageCircle, Accessibility, Eye, Type, Minus, Phone, Mail, MapPin, Navigation, Lock, Underline, Palette, ZapOff } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import LegalModal, { LegalType } from './LegalModal';
import { useSite } from '../context/SiteContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get dynamic data
  const { general } = useSite();
  
  // Legal Modal State
  const [legalModalType, setLegalModalType] = useState<LegalType>(null);

  // Accessibility State
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  
  // Accessibility Features
  const [textSizeLevel, setTextSizeLevel] = useState(0); // 0 = normal, 1 = large, 2 = extra large
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);

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

  // Construct Accessibility Classes
  const getAccessClasses = () => {
      let classes = "min-h-screen flex flex-col transition-all duration-300 ";
      
      // Text Size
      if (textSizeLevel === 1) classes += " text-lg ";
      if (textSizeLevel === 2) classes += " text-xl ";

      // Visuals
      if (highContrast) classes += " contrast-125 saturate-150 ";
      if (grayscale) classes += " grayscale ";
      if (readableFont) classes += " font-sans-system "; // Will require inline style or tailwind config, simplified here by logic below
      
      return classes;
  };

  const resetAccess = () => {
      setTextSizeLevel(0);
      setHighContrast(false);
      setGrayscale(false);
      setHighlightLinks(false);
      setReadableFont(false);
      setStopAnimations(false);
  };

  const toggleTextSize = () => {
      setTextSizeLevel(prev => (prev + 1) % 3);
  };

  return (
    <div 
        className={getAccessClasses()} 
        style={{ 
            fontFamily: readableFont ? 'Arial, sans-serif' : undefined,
            backgroundColor: highContrast ? '#ffffff' : '#FAF9F6',
            color: highContrast ? '#000000' : undefined
        }}
    >
      {/* Global Style Overrides for Accessibility */}
      <style>{`
        ${highlightLinks ? `a { text-decoration: underline !important; font-weight: bold !important; color: #0000EE !important; }` : ''}
        ${stopAnimations ? `* { animation: none !important; transition: none !important; }` : ''}
        ${highContrast ? `
            .bg-[#1a2e1a] { background-color: #000000 !important; }
            .text-green-800 { color: #000000 !important; }
            button { border: 2px solid #000 !important; }
        ` : ''}
      `}</style>

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
                {!stopAnimations && (
                    <motion.div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-70"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                )}
            </div>
            <span className={`text-2xl font-bold tracking-wide ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              {general.siteName}
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
                  className="text-2xl font-bold text-gray-800 hover:text-green-700"
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

      {/* Footer - Compact Version */}
      <footer className="bg-[#1a2e1a] text-white py-8 border-t border-green-800 relative z-30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-start text-right">
            
            {/* About Column */}
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                 <Leaf className="text-green-400" size={18}/> {general.siteName}
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-sm text-sm">
                {general.aboutShort}
              </p>
            </div>
            
            {/* Contact Details Column */}
            <div className="flex flex-col items-start">
              <h4 className="text-lg font-bold mb-3 text-green-100">פרטי התקשרות</h4>
              <ul className="space-y-2 flex flex-col items-start w-full text-sm">
                <li>
                    <a href={`tel:${general.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                      <Phone size={16} className="text-green-400 group-hover:text-green-300"/>
                      <span className="group-hover:underline">{general.phone}</span>
                    </a>
                </li>
                <li>
                    <a href={`mailto:${general.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                      <Mail size={16} className="text-green-400 group-hover:text-green-300"/>
                      <span className="group-hover:underline">{general.email}</span>
                    </a>
                </li>
                <li className="flex flex-col items-start gap-1 text-gray-300">
                   <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-400"/>
                      <span>{general.address}</span>
                   </div>
                   <a 
                      href={`https://waze.com/ul?q=${encodeURIComponent(general.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full transition-colors mr-6"
                   >
                      <Navigation size={10} />
                      נווט עם Waze
                   </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Legal Links */}
          <div className="mt-8 pt-4 border-t border-green-900 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} {general.siteName}.</span>
              
              {/* ADMIN LINK - Only visible on Contact page */}
              {location.pathname === '/contact' && (
                  <Link to="/admin" className="text-white/30 hover:text-white transition-colors p-1" aria-label="כניסה לניהול">
                      <Lock size={12} />
                  </Link>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
               <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition-colors hover:underline">
                  מדיניות פרטיות
               </button>
               <button onClick={() => setLegalModalType('terms')} className="hover:text-white transition-colors hover:underline">
                  תנאי שימוש
               </button>
               <button onClick={() => setLegalModalType('health')} className="hover:text-white transition-colors hover:underline">
                  הצהרת בריאות
               </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Buttons (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        
        {/* Accessibility Menu (Conditional) - Appears above buttons */}
        <AnimatePresence>
            {isAccessMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="mb-2 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 w-[240px] absolute bottom-full left-0 mb-4 origin-bottom-left"
                >
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <span className="font-bold text-gray-800 flex items-center gap-2"><Accessibility size={18}/> נגישות</span>
                        <button onClick={() => setIsAccessMenuOpen(false)}><X size={16}/></button>
                    </div>
                    
                    <div className="space-y-2">
                        <button 
                            onClick={toggleTextSize}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${textSizeLevel > 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <span className="flex items-center gap-2"><Type size={16} /> גודל טקסט</span>
                            <span className="text-xs bg-white px-2 rounded border">{textSizeLevel === 0 ? 'רגיל' : textSizeLevel === 1 ? 'גדול' : 'ענק'}</span>
                        </button>

                        <button 
                            onClick={() => setHighContrast(!highContrast)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${highContrast ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <Eye size={16} /> ניגודיות גבוהה
                        </button>

                        <button 
                            onClick={() => setGrayscale(!grayscale)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${grayscale ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <Palette size={16} /> גווני אפור
                        </button>

                        <button 
                            onClick={() => setHighlightLinks(!highlightLinks)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${highlightLinks ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <Underline size={16} /> הדגשת קישורים
                        </button>

                        <button 
                            onClick={() => setReadableFont(!readableFont)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${readableFont ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <span className="font-sans">א</span> פונט קריא
                        </button>

                        <button 
                            onClick={() => setStopAnimations(!stopAnimations)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${stopAnimations ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <ZapOff size={16} /> עצור אנימציות
                        </button>

                         <button 
                            onClick={resetAccess}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 border border-red-100 mt-2 font-bold"
                        >
                            <Minus size={16} /> איפוס הגדרות
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Accessibility Button */}
        <button 
            onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 relative z-50"
            aria-label="תפריט נגישות"
        >
            <Accessibility size={24} />
        </button>

        {/* WhatsApp Button (Bottom) */}
        <a 
            href={`https://wa.me/972${general.phone.replace(/\D/g,'')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 relative z-40"
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