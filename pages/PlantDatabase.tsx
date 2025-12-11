import React, { useState } from 'react';
import { PLANTS } from '../services/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
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
            <div className="text-sm text-gray-500 font-medium">
               מציג {currentPage * ITEMS_PER_PAGE + 1} - {Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredPlants.length)} מתוך {filteredPlants.length}
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className={`p-2 rounded-full border transition-all ${currentPage === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronRight size={24} />
                </button>
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages - 1}
                    className={`p-2 rounded-full border transition-all ${currentPage === totalPages - 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronLeft size={24} />
                </button>
            </div>
          </div>
        )}

        {/* Grid Display - 4 in a row, smaller cards */}
        <div className="relative min-h-[400px]">
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