import React, { useState } from 'react';
import { PLANTS } from '../services/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, ChevronLeft, Tag } from 'lucide-react';
import { Plant } from '../types';
import { CATEGORY_LABELS } from '../constants';
import PlantModal from '../components/PlantModal';

const PlantDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Constants
  const ITEMS_PER_PAGE = 8; // 2 rows of 4
  const categories = ['all', ...Array.from(new Set(PLANTS.map(p => p.category)))];

  // Filter Logic
  const filteredPlants = PLANTS.filter(plant => {
    const matchesSearch = plant.hebrewName.includes(searchTerm) || plant.latinName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const currentPlants = filteredPlants.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20 relative">
      
      {/* Header Section */}
      <div className="bg-[#1a2e1a] pt-32 pb-12 text-white rounded-b-[3rem] shadow-xl mb-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">אינדקס צמחים</h1>
          <p className="text-green-100 max-w-xl mx-auto mb-8">
            סיור וירטואלי בעולם צמחי המרפא.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <input
                type="text"
                placeholder="חיפוש צמח..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-12 pl-6 rounded-full text-gray-800 bg-white/95 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/30 shadow-lg transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Categories / Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat 
                        ? 'bg-[#1a2e1a] text-white shadow-md' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {CATEGORY_LABELS[cat] || cat}
                </button>
            ))}
        </div>

        {/* Horizontal Navigation Controls (Desktop) */}
        {filteredPlants.length > 0 && (
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="text-xs text-gray-500 font-medium">
               מציג {currentPage * ITEMS_PER_PAGE + 1} - {Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredPlants.length)} מתוך {filteredPlants.length}
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className={`p-1.5 rounded-full border transition-all ${currentPage === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronRight size={18} />
                </button>
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages - 1}
                    className={`p-1.5 rounded-full border transition-all ${currentPage === totalPages - 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronLeft size={18} />
                </button>
            </div>
          </div>
        )}

        {/* Grid Display - Updated Cards */}
        <div className="relative min-h-[300px]">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={currentPage + selectedCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {currentPlants.map((plant) => (
                        <motion.div
                            key={plant.id}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => setSelectedPlant(plant)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-[320px] border border-gray-100 group relative"
                        >
                            {/* Top Section: Names */}
                            <div className="px-5 pt-5 pb-3 bg-white z-10">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-xl font-serif font-bold text-gray-800 group-hover:text-green-800 transition-colors">
                                        {plant.hebrewName}
                                    </h3>
                                    <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        {CATEGORY_LABELS[plant.category]}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 italic font-serif">{plant.latinName}</p>
                            </div>

                            {/* Main Image Area with Tags Overlay */}
                            <div className="relative flex-grow w-full overflow-hidden">
                                <img 
                                    src={plant.imageUrl} 
                                    alt={plant.hebrewName} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Very Subtle Gradient - Only at the very bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                                
                                {/* Tags on Image - Strictly limited to 2 lines max */}
                                <div className="absolute bottom-3 right-3 left-3 flex flex-wrap gap-1.5 justify-start max-h-[46px] overflow-hidden content-end">
                                    {plant.benefits.map((benefit, i) => (
                                        <span key={i} className="bg-white/80 backdrop-blur-[2px] text-[#1a2e1a] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap border border-white/40">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
             </AnimatePresence>
        </div>
        
        {filteredPlants.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p>לא נמצאו צמחים התואמים את החיפוש.</p>
            </div>
        )}
      </div>

      {/* Modal - Floating Window with Tabs */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlantDatabase;