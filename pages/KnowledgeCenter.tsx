import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, ChevronLeft, Sprout, FileText, BookOpen, X, Check, Tag } from 'lucide-react';
import { Plant, Article, ContentItem } from '../types';
import { TYPE_LABELS } from '../constants';
import PlantModal from '../components/PlantModal';
import ArticleModal from '../components/ArticleModal';
import { useSite } from '../context/SiteContext';

const KnowledgeCenter: React.FC = () => {
  const { content: allContent } = useSite();

  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(''); // What the user types
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Modal States
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Constants
  const ITEMS_PER_PAGE = 9;

  // Extract all unique tags/benefits
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allContent.forEach(item => {
        if (item.type === 'plant') {
            item.benefits.forEach(b => tags.add(b));
        } else {
            item.tags.forEach(t => tags.add(t));
        }
    });
    return Array.from(tags).sort();
  }, [allContent]);

  // Tag Suggestions Logic
  const tagSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const lowerInput = inputValue.toLowerCase();
    return allTags.filter(tag => 
        tag.toLowerCase().includes(lowerInput) && 
        !selectedTags.includes(tag)
    );
  }, [inputValue, allTags, selectedTags]);

  // Handle Input Change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      setSearchTerm(val); // Real-time free text search
      setShowSuggestions(val.length > 0);
  };

  // Handle Tag Selection from Suggestions
  const handleSuggestionClick = (tag: string) => {
      setSelectedTags(prev => [...prev, tag]);
      setInputValue(''); // Clear input for next tag/search
      setSearchTerm(''); // Clear free text search as we moved to tag mode
      setShowSuggestions(false);
  };

  const clearSearch = () => {
      setInputValue('');
      setSearchTerm('');
      setShowSuggestions(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle Tag Selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(0);
  };

  // Filter Logic
  const filteredContent = allContent.filter(item => {
    // 1. Text Search
    const searchLower = searchTerm.toLowerCase();
    let textMatch = false;

    // If searchTerm is empty, textMatch is true (ignore text filter)
    if (!searchTerm) {
        textMatch = true;
    } else {
        if (item.type === 'plant') {
            textMatch = item.hebrewName.includes(searchTerm) || item.latinName.toLowerCase().includes(searchLower);
        } else {
            textMatch = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
        }
    }

    // 2. Type Matching
    const typeMatch = selectedType === 'all' || item.type === selectedType;

    // 3. Tag Matching (OR Logic for selected tags)
    let tagMatch = true;
    if (selectedTags.length > 0) {
        const itemTags = item.type === 'plant' ? item.benefits : item.tags;
        tagMatch = selectedTags.some(tag => itemTags.includes(tag));
    }

    return textMatch && typeMatch && tagMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const currentItems = filteredContent.slice(
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
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedType, selectedTags]);

  const handleCardClick = (item: ContentItem) => {
       // Close existing
      setSelectedPlant(null);
      setSelectedArticle(null);
      
      if (item.type === 'plant') {
          setSelectedPlant(item as Plant);
      } else {
          setSelectedArticle(item as Article);
      }
  };

  // Helper for badges
  const getBadgeConfig = (type: string) => {
      switch(type) {
          case 'plant': return { color: 'bg-[#1a2e1a]', icon: <Sprout size={12} />, label: 'צמח מרפא' };
          case 'article': return { color: 'bg-green-600', icon: <FileText size={12} />, label: 'מאמר' };
          case 'case_study': return { color: 'bg-blue-600', icon: <BookOpen size={12} />, label: 'מקרה אירוע' };
          default: return { color: 'bg-gray-500', icon: null, label: 'כללי' };
      }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20 relative">
      
      {/* Header Background Only */}
      <div 
        className="pt-32 pb-24 text-white rounded-b-[3rem] shadow-xl relative overflow-hidden"
        style={{
            backgroundImage: 'url("https://picsum.photos/seed/herbal_bg_2/1600/600")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
             <div className="absolute right-10 top-10 w-64 h-64 rounded-full border-4 border-white/20"></div>
             <div className="absolute left-20 bottom-10 w-40 h-40 rounded-full border-4 border-white/10"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">מרכז הידע</h1>
          <p className="text-green-100 max-w-xl mx-auto text-lg font-light">
            מאגר המידע השלם: צמחי מרפא, מאמרים מקצועיים ומקרי אירוע.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-20 -mt-8">
        
        {/* Unified Toolbar - Mobile Stacked */}
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100 mb-12">
            
            {/* Line 1: Type Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full md:w-auto">
                {['all', 'plant', 'article', 'case_study'].map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-grow md:flex-grow-0 ${
                            selectedType === type 
                            ? 'bg-[#1a2e1a] text-white shadow-md' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {TYPE_LABELS[type]}
                    </button>
                ))}
            </div>

            {/* Line 2: Search */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
                
                {/* Search Input with Autocomplete */}
                <div className="relative w-full md:w-80" ref={searchContainerRef}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="חיפוש חופשי או הקלד תגית..."
                            value={inputValue}
                            onChange={handleSearchInput}
                            onFocus={() => setShowSuggestions(inputValue.length > 0)}
                            className="w-full py-2.5 pr-10 pl-8 rounded-xl text-gray-800 bg-gray-50 border border-transparent focus:bg-white focus:border-green-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        {inputValue && (
                            <button 
                                onClick={clearSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && tagSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                            >
                                <div className="p-2">
                                    <p className="text-xs text-gray-400 px-2 py-1 mb-1">תגיות מוצעות:</p>
                                    {tagSuggestions.map((tag, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(tag)}
                                            className="w-full text-right px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-50 text-gray-700 hover:text-green-800 transition-colors"
                                        >
                                            <Tag size={12} className="text-green-500"/>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 items-center">
                <span className="text-sm text-gray-500 ml-2">מסננים פעילים:</span>
                {selectedTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="flex items-center gap-1.5 bg-white border border-green-200 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors group shadow-sm"
                    >
                        <span>{tag}</span>
                        <X size={12} className="opacity-50 group-hover:opacity-100" />
                    </button>
                ))}
                <button onClick={() => setSelectedTags([])} className="text-xs text-gray-400 underline hover:text-red-500 mr-2">נקה הכל</button>
            </div>
        )}

        {/* Content Grid / Scroll */}
        <div className="relative min-h-[300px]">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={currentPage + selectedType + selectedTags.join(',')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-6 md:px-0 -mx-6 md:mx-0 scroll-smooth snap-x snap-mandatory"
                >
                    {currentItems.map((item) => {
                        const badge = getBadgeConfig(item.type);
                        
                        return (
                        <motion.div
                            key={(item.type === 'plant' ? 'p-' : 'a-') + item.id}
                            layoutId={(item.type === 'plant' ? 'plant-' : 'article-') + item.id}
                            whileHover={{ y: -8 }}
                            onClick={() => handleCardClick(item)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-[400px] border border-gray-100 group min-w-[40vw] md:min-w-0 snap-center"
                        >
                            {/* Image Section */}
                            <div className="relative h-56 overflow-hidden">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.type === 'plant' ? item.hebrewName : item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                
                                {/* TYPE BADGE - Top Right */}
                                <div className={`absolute top-4 right-4 ${badge.color} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5`}>
                                    {badge.icon}
                                    <span>{badge.label}</span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-auto">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-800 transition-colors line-clamp-1">
                                        {item.type === 'plant' ? item.hebrewName : item.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-400 font-medium mb-3">
                                        {item.type === 'plant' ? item.latinName : item.date}
                                    </p>
                                    
                                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                                        {item.type === 'plant' ? item.description : item.summary}
                                    </p>
                                </div>

                                {/* Bottom Info */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <div className="text-green-700 font-bold group-hover:underline">
                                        קרא עוד
                                    </div>
                                    {item.type === 'plant' && (
                                        <div className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">
                                            {item.category}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </motion.div>
             </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {filteredContent.length > 0 && (
          <div className="flex justify-center items-center mt-8 md:mt-16 gap-6">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className={`p-3 rounded-full border transition-all flex items-center gap-2 ${currentPage === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronRight size={20} />
                </button>
                
                <span className="text-sm font-medium text-gray-500">
                    עמוד {currentPage + 1} מתוך {totalPages}
                </span>

                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages - 1}
                    className={`p-3 rounded-full border transition-all flex items-center gap-2 ${currentPage === totalPages - 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                >
                    <ChevronLeft size={20} />
                </button>
          </div>
        )}
        
        {filteredContent.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p>לא נמצאו תוצאות התואמים את החיפוש.</p>
                <div className="flex gap-4 justify-center mt-4">
                    <button 
                        onClick={() => {setSearchTerm(''); setInputValue(''); setSelectedType('all'); setSelectedTags([])}}
                        className="text-green-700 font-bold hover:underline"
                    >
                        נקה את כל הסינונים
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantModal 
            plant={selectedPlant} 
            onClose={() => setSelectedPlant(null)} 
            onSwitchItem={handleCardClick}
          />
        )}
        {selectedArticle && (
          <ArticleModal 
            article={selectedArticle} 
            onClose={() => setSelectedArticle(null)}
            onSwitchItem={handleCardClick}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default KnowledgeCenter;