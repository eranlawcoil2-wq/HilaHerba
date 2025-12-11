import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Hero: React.FC = () => {
  const { slides } = useSite();
  const activeSlides = slides.filter(s => s.active);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  if (activeSlides.length === 0) return null;

  const activeSlide = activeSlides[currentSlide];

  return (
    <section className="relative min-h-auto md:min-h-[85vh] flex items-center overflow-hidden bg-[#FAF9F6] pt-32 pb-20 md:pt-0 md:pb-0">
      
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center h-full relative z-10">
        
        {/* RIGHT SIDE: Text */}
        <div className="text-right order-1 md:order-1 flex flex-col justify-center items-start md:pr-12">
           <AnimatePresence mode="wait">
               <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full"
               >
                  <div className="flex items-center gap-2 text-green-700 font-bold tracking-widest uppercase text-sm mb-4">
                    <Sprout size={18} />
                    <span>{activeSlide.subtitle}</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a2e1a] mb-6 leading-tight break-words">
                    {activeSlide.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-light max-w-lg">
                    {activeSlide.text}
                  </p>

                  <div className="flex justify-start gap-4">
                    <Link 
                      to="/contact" 
                      className="group px-8 py-3 bg-[#1a2e1a] text-white rounded-full font-medium hover:bg-green-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                      <span>גלו עוד</span> 
                    </Link>
                  </div>
               </motion.div>
           </AnimatePresence>

            {/* Controls */}
            {activeSlides.length > 1 && (
            <div className="flex items-center gap-4 mt-12">
                 <button onClick={nextSlide} className="p-3 rounded-full border border-gray-300 hover:bg-[#1a2e1a] hover:text-white hover:border-[#1a2e1a] transition-all">
                    <ChevronRight size={20} />
                </button>
                <div className="flex gap-2">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide ? 'w-8 bg-[#1a2e1a]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
                <button onClick={prevSlide} className="p-3 rounded-full border border-gray-300 hover:bg-[#1a2e1a] hover:text-white hover:border-[#1a2e1a] transition-all">
                    <ChevronLeft size={20} />
                </button>
            </div>
            )}
        </div>

        {/* LEFT SIDE: Image */}
        <div className="relative h-[40vh] md:h-[65vh] w-full order-2 md:order-2">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeSlide.id}
                    className="w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <img 
                        src={activeSlide.image} 
                        alt={activeSlide.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </motion.div>
            </AnimatePresence>
            
            <div className="absolute -top-8 -left-8 w-40 h-40 md:w-64 md:h-64 bg-green-100/50 rounded-full -z-10 blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 md:w-48 md:h-48 bg-[#D2B48C]/30 rounded-full -z-10 blur-2xl"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;