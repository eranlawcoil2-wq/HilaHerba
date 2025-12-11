import React, { useState, useMemo, useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import { PLANTS, ARTICLES } from '../services/data';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Leaf, Search, Filter, Sprout, FileText, BookOpen, X, Check } from 'lucide-react';
import { Plant, Article, ContentItem } from '../types';
import { TYPE_LABELS } from '../constants';
import PlantModal from '../components/PlantModal';
import ArticleModal from '../components/ArticleModal';

const Home: React.FC = () => {
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const tagMenuRef = useRef<HTMLDivElement>(null);
  
  // Modal States
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Constants
  const ITEMS_PER_PAGE = 8;

  // Combine Data
  const allContent: ContentItem[] = useMemo(() => [
    ...PLANTS.map(p => ({ ...p, type: 'plant' as const })),
    ...ARTICLES
  ], []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PLANTS.forEach(p => p.benefits.forEach(b => tags.add(b)));
    ARTICLES.forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Close tag menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target as Node)) {
        setIsTagMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(0);
  };

  // Filter Logic
  const filteredContent = allContent.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    let textMatch = false;
    if (item.type === 'plant') {
        textMatch = item.hebrewName.includes(searchTerm) || item.latinName.toLowerCase().includes(searchLower);
    } else {
        textMatch = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    }

    const typeMatch = selectedType === 'all' || item.type === selectedType;

    let tagMatch = true;
    if (selectedTags.length > 0) {
        const itemTags = item.type === 'plant' ? item.benefits : item.tags;
        tagMatch = selectedTags.some(tag => itemTags.includes(tag));
    }

    return textMatch && typeMatch && tagMatch;
  });

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

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedType]);

   const handleCardClick = (item: ContentItem) => {
      // Close existing
      setSelectedPlant(null);
      setSelectedArticle(null);

      if (item.type === 'plant') {
          setSelectedPlant(item);
      } else {
          setSelectedArticle(item);
      }
  };

  const getBadgeConfig = (type: string) => {
      switch(type) {
          case 'plant': return { color: 'bg-[#1a2e1a]', icon: <Sprout size={12} />, label: 'צמח מרפא' };
          case 'article': return { color: 'bg-green-600', icon: <FileText size={12} />, label: 'מאמר' };
          case 'case_study': return { color: 'bg-blue-600', icon: <BookOpen size={12} />, label: 'מקרה בוחן' };
          default: return { color: 'bg-gray-500', icon: null, label: 'כללי' };
      }
  };

  return (
    <div className="pb-20 bg-[#FAF9F6]">
      <Hero />

      {/* About Section - Moved Up */}
      <section className="py-24 bg-[#1a2e1a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <Leaf size={400} className="absolute -left-20 -top-20 rotate-45" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
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
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D2B48C] rounded-full flex items-center justify-center text-[#1a2e1a] font-serif font-bold text-center leading-tight shadow-xl">
                    15+<br/><span className="text-xs font-sans font-normal">שנות ניסיון</span>
                </div>
            </motion.div>

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

      {/* Unified Knowledge Center Section */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12">
             <h3 className="text-3xl font-serif font-bold text-[#1a2e1a] mb-2 text-center md:text-right">מרכז הידע</h3>
             <p className="text-gray-500 text-center md:text-right">חיפוש בכל המאמרים, הצמחים ומקרי הבוחן</p>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-xl p-2 md:p-3 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100 mb-12 relative z-20">
             {/* Right: Types */}
             <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full md:w-auto">
                {['all', 'plant', 'article', 'case_study'].map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedType === type 
                            ? 'bg-[#1a2e1a] text-white shadow-md' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {TYPE_LABELS[type]}
                    </button>
                ))}
            </div>

            {/* Left: Search & Tags */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
                 {/* Tag Menu */}
                 <div className="relative w-full md:w-auto" ref={tagMenuRef}>
                    <button
                        onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                        className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border w-full md:w-48 transition-all ${
                            selectedTags.length > 0 || isTagMenuOpen 
                            ? 'border-green-600 text-green-700 bg-green-50' 
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <span className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                            <Filter size={16} />
                            {selectedTags.length > 0 ? `${selectedTags.length} נבחרו` : 'סינון לפי נושא'}
                        </span>
                    </button>
                    <AnimatePresence>
                        {isTagMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-2 w-full md:w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-2 custom-scrollbar"
                            >
                                <div className="space-y-1">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`w-full text-right px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${
                                                selectedTags.includes(tag) 
                                                ? 'bg-green-50 text-green-800 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{tag}</span>
                                            {selectedTags.includes(tag) && <Check size={14} className="text-green-600"/>}
                                        </button>
                                    ))}
                                </div>
                                {selectedTags.length > 0 && (
                                    <div className="pt-2 mt-2 border-t border-gray-100">
                                        <button 
                                            onClick={() => setSelectedTags([])}
                                            className="w-full text-center text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
                                        >
                                            נקה הכל
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>

                 {/* Search */}
                 <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="חיפוש חופשי..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2.5 pr-10 pl-4 rounded-xl text-gray-800 bg-gray-50 border border-transparent focus:bg-white focus:border-green-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
          </div>

          {/* Selected Tags */}
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

          {/* Grid */}
          <div className="relative min-h-[300px]">
             <AnimatePresence mode="wait">
                 <motion.div 
                    key={currentPage + selectedType + selectedTags.join(',')}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                 >
                    {currentItems.map((item) => {
                         const badge = getBadgeConfig(item.type);
                         return (
                          <motion.div
                            key={(item.type === 'plant' ? 'p-' : 'a-') + item.id}
                            layoutId={(item.type === 'plant' ? 'plant-' : 'article-') + item.id}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => handleCardClick(item)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-[320px] border border-gray-100 group relative"
                          >
                             {/* Top Section */}
                             <div className="px-5 pt-5 pb-3 bg-white z-10">
                                 <div className="flex justify-between items-start mb-1">
                                     <h3 className="text-xl font-serif font-bold text-gray-800 group-hover:text-green-800 transition-colors line-clamp-1">
                                         {item.type === 'plant' ? item.hebrewName : item.title}
                                     </h3>
                                     <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white ${badge.color}`}>
                                        {badge.icon} {badge.label}
                                     </div>
                                 </div>
                                 <p className="text-sm text-gray-400 italic font-serif">
                                     {item.type === 'plant' ? item.latinName : item.date}
                                 </p>
                             </div>

                             {/* Image */}
                             <div className="relative flex-grow w-full overflow-hidden">
                                 <img 
                                     src={item.imageUrl} 
                                     alt={item.type === 'plant' ? item.hebrewName : item.title} 
                                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                 />
                                 <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                                 
                                 <div className="absolute bottom-3 right-3 left-3">
                                     <p className="text-white text-xs line-clamp-2 font-light leading-relaxed mb-2">
                                        {item.type === 'plant' ? item.description : item.summary}
                                     </p>
                                     <div className="flex flex-wrap gap-1">
                                        {(item.type === 'plant' ? item.benefits : item.tags).slice(0, 2).map((tag, i) => (
                                            <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded border border-white/20">
                                                {tag}
                                            </span>
                                        ))}
                                     </div>
                                 </div>
                             </div>
                          </motion.div>
                    )})}
                 </motion.div>
             </AnimatePresence>
          </div>

          {/* Pagination */}
          {filteredContent.length > 0 && (
            <div className="flex justify-center items-center mt-12 gap-6">
                 <button 
                        onClick={prevPage} 
                        disabled={currentPage === 0}
                        className={`p-2 rounded-full border transition-all ${currentPage === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages - 1}
                        className={`p-2 rounded-full border transition-all ${currentPage === totalPages - 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
            </div>
          )}

        </div>
      </section>

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

export default Home;