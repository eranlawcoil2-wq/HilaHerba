import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, BookOpen, Sprout, FileText, Calendar } from 'lucide-react';
import { Plant, ContentItem } from '../types';
import { TYPE_LABELS } from '../constants';
import { useSite } from '../context/SiteContext';
import SEO from './SEO';

interface PlantModalProps {
  plant: Plant;
  onClose: () => void;
  onSwitchItem?: (item: ContentItem) => void;
}

const PlantModal: React.FC<PlantModalProps> = ({ plant, onClose, onSwitchItem }) => {
    const [activeTabId, setActiveTabId] = useState<string>('general');
    const { content: allContent } = useSite();

    // Calculate related items
    const relatedItems: ContentItem[] = useMemo(() => {
        return allContent
            .filter(item => {
                if (item.type === 'plant' && item.id === plant.id) return false;
                const itemTags = item.type === 'plant' ? item.benefits : item.tags;
                return plant.benefits.some(tag => itemTags.includes(tag));
            })
            .slice(0, 4);
    }, [plant, allContent]);

    // Ensure we have tabs, if empty create default
    const tabs = plant.tabs && plant.tabs.length > 0 ? plant.tabs : [];

    // JSON-LD for Plant/Product
    const plantSchema = {
        "@type": "Product",
        "name": plant.hebrewName,
        "alternateName": plant.latinName,
        "description": plant.description,
        "image": plant.imageUrl,
        "category": plant.category
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <SEO 
                title={plant.hebrewName}
                description={`${plant.hebrewName} (${plant.latinName}) - ${plant.description}`}
                image={plant.imageUrl}
                schema={plantSchema}
            />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`plant-${plant.id}`}
                className="bg-[#FAF9F6] w-full max-w-5xl h-[90vh] md:h-[750px] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row z-10"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 z-30 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors shadow-sm"
                >
                    <X size={20} />
                </button>

                {/* Left Side Image */}
                <div className="w-full md:w-5/12 h-64 md:h-full relative flex-shrink-0">
                    <img 
                        src={plant.imageUrl} 
                        alt={plant.hebrewName} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1a2e1a]/20"></div>
                    
                    <div className="absolute bottom-4 right-4 left-4 z-20 flex flex-col gap-2">
                         <div className="flex flex-wrap gap-1.5">
                            {plant.benefits.slice(0, 4).map((benefit, i) => (
                                <span key={i} className="bg-black/30 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                                    {benefit}
                                </span>
                            ))}
                        </div>
                        <div className="text-white md:hidden mt-1">
                            <h2 className="text-3xl font-bold leading-tight">{plant.hebrewName}</h2>
                            <p className="text-green-100 italic text-sm opacity-90">{plant.latinName}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Content */}
                <div className="w-full md:w-7/12 flex flex-col bg-[#FAF9F6] overflow-hidden relative rounded-t-3xl md:rounded-none -mt-4 md:mt-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">
                    
                    <div className="hidden md:block p-8 pb-0">
                         <div className="flex justify-between items-start mb-1">
                             <h2 className="text-4xl font-bold text-[#1a2e1a]">{plant.hebrewName}</h2>
                             {plant.date && (
                                 <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                     <Calendar size={12} />
                                     <span>עודכן לאחרונה: {plant.date}</span>
                                 </div>
                             )}
                         </div>
                         <p className="text-gray-500 italic text-lg">{plant.latinName}</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-6 px-4 md:px-8 mt-6 border-b border-gray-200 flex-shrink-0 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTabId('general')}
                            className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTabId === 'general' ? 'text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            כללי
                            {activeTabId === 'general' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-green-800" />}
                        </button>
                        
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTabId === tab.id ? 'text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.title}
                                {activeTabId === tab.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-green-800" />}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-grow custom-scrollbar">
                        <div className="p-6 md:p-8 pb-4 min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {activeTabId === 'general' ? (
                                    <motion.div 
                                        key="general"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <BookOpen className="text-green-600 mt-1 flex-shrink-0" size={20} />
                                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                                {plant.description}
                                            </p>
                                        </div>
                                        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <h4 className="font-bold text-gray-800 mb-2 text-sm">קטגוריה טיפולית</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="text-gray-600 capitalize">{plant.category}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                <Leaf className="text-green-600" size={16} />
                                                סגולות עיקריות
                                            </h4>
                                            <ul className="grid gap-2">
                                                {plant.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 bg-white p-2 px-3 rounded-lg border border-gray-50 text-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                        <span className="text-gray-700">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    tabs.map(tab => {
                                        if (tab.id !== activeTabId) return null;
                                        return (
                                            <motion.div 
                                                key={tab.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-4"
                                            >
                                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2">{tab.title}</h3>
                                                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {tab.content}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>

                         {/* Related Items */}
                        {relatedItems.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-200 p-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">תכנים נוספים שעשויים לעניין אותך</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {relatedItems.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => onSwitchItem?.(item)}
                                            className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 group"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.type === 'plant' ? item.hebrewName : item.title} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                                     {TYPE_LABELS[item.type]}
                                                </span>
                                                <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-green-700 transition-colors">
                                                    {item.type === 'plant' ? item.hebrewName : item.title}
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PlantModal;