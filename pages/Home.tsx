import React, { useState } from 'react';
import Hero from '../components/Hero';
import { PLANTS } from '../services/data';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Plant } from '../types';
import { CATEGORY_LABELS } from '../constants';
import PlantModal from '../components/PlantModal';

const Home: React.FC = () => {
  // Plant Section State
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  const ITEMS_PER_PAGE = 8; // 2 rows of 4
  const totalPages = Math.ceil(PLANTS.length / ITEMS_PER_PAGE);
  
  const displayedPlants = PLANTS.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="pb-20">
      <Hero />

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a2e1a] mb-6">רפואה עתיקה, הבנה חדשה</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              ברוכים הבאים ל-Herbal.co.il. האתר משמש כמרכז ידע מקיף למטפלים ולקהל הרחב.
              כאן תמצאו מידע מעמיק על צמחי מרפא, מחקרים עדכניים, ומקרי בוחן מהקליניקה.
              המטרה שלנו היא להנגיש את חוכמת הצמחים בצורה נקייה, ברורה ומקצועית.
            </p>
            <div className="w-24 h-1 bg-green-200 mx-auto rounded-full"></div>
           </motion.div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h3 className="text-3xl font-serif font-bold text-[#1a2e1a] mb-2">מתוך האינדקס</h3>
                <p className="text-gray-500">סיור וירטואלי במאגר צמחי המרפא</p>
            </div>
            
            <div className="flex items-center gap-4">
                 {/* Navigation Arrows */}
                 <div className="flex gap-2">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 0}
                        className={`p-2 rounded-full border transition-all ${currentPage === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages - 1}
                        className={`p-2 rounded-full border transition-all ${currentPage === totalPages - 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
                <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>
                <Link to="/plants" className="hidden md:flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition-colors whitespace-nowrap">
                    כל הצמחים <ArrowLeft size={16} />
                </Link>
            </div>
          </div>

          <div className="relative min-h-[400px]">
             <AnimatePresence mode="wait">
                 <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                 >
                    {displayedPlants.map((plant) => (
                      <motion.div
                        key={plant.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedPlant(plant)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-[320px] border border-gray-100 group"
                      >
                         {/* Text Top */}
                         <div className="p-5 flex-grow flex flex-col relative">
                                <span className="absolute top-4 left-4 bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {CATEGORY_LABELS[plant.category]}
                                </span>
                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-1 group-hover:text-green-800 transition-colors">
                                    {plant.hebrewName}
                                </h3>
                                <p className="text-xs text-gray-400 italic mb-3 font-serif">{plant.latinName}</p>
                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                    {plant.description}
                                </p>
                                <div className="mt-auto pt-2 text-green-600 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    למידע נוסף <ChevronLeft size={12} />
                                </div>
                         </div>
                         
                         {/* Image Bottom */}
                         <div className="h-2/5 w-full relative overflow-hidden">
                                <img 
                                    src={plant.imageUrl} 
                                    alt={plant.hebrewName} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                      </motion.div>
                    ))}
                 </motion.div>
             </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/plants" className="inline-flex items-center gap-2 text-green-700 font-medium">
                כל הצמחים <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#1a2e1a] text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <Leaf size={400} className="absolute -left-20 -top-20 rotate-45" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Image Side */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                <div className="relative h-[500px] w-full rounded-t-[200px] rounded-b-[20px] overflow-hidden border-2 border-white/10">
                    <img 
                        src="https://picsum.photos/seed/portrait/600/800" 
                        alt="Herbalist Portrait" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply"></div>
                </div>
                {/* Decorative floating element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D2B48C] rounded-full flex items-center justify-center text-[#1a2e1a] font-serif font-bold text-center leading-tight shadow-xl">
                    15+<br/><span className="text-xs font-sans font-normal">שנות ניסיון</span>
                </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <span className="text-green-300 font-medium tracking-widest uppercase text-sm mb-4 block">
                    נעים להכיר
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                    שמי נעה,<br/> מטפלת בצמחי מרפא
                </h2>
                <div className="w-20 h-1 bg-green-500 mb-8"></div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    החיבור שלי לעולם הצמחים התחיל עוד בילדות, בטיולים בטבע ובליקוט צמחים עם סבתי.
                    אני מאמינה שליקוט, הכנה ורקיחה הם חלק בלתי נפרד מתהליך הריפוי.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-10">
                    בקליניקה שלי אני משלבת ידע מסורתי עתיק עם הבנה מדעית מודרנית ופתולוגיה מערבית,
                    כדי להעניק לגוף את הכלים המדויקים להם הוא זקוק כדי לרפא את עצמו. כל מטופל מקבל יחס אישי והתאמה של פורמולות ייחודיות.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        to="/about" 
                        className="px-8 py-3 bg-white text-[#1a2e1a] rounded-full font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                    >
                        קראו עוד עלי
                    </Link>
                    <Link 
                        to="/contact" 
                        className="px-8 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                        תיאום פגישה
                    </Link>
                </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modal - Floating Window with Tabs */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;