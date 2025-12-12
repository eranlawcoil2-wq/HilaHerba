import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Utensils, ChefHat, Clock, Flame } from 'lucide-react';
import { Recipe, ContentItem } from '../types';
import { TYPE_LABELS } from '../constants';
import { useSite } from '../context/SiteContext';
import SEO from './SEO';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onSwitchItem?: (item: ContentItem) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onSwitchItem }) => {
    const [activeTabId, setActiveTabId] = useState<string>('summary');
    const { content: allContent } = useSite();

    const relatedItems: ContentItem[] = useMemo(() => {
        return allContent
            .filter(item => {
                if (item.id === recipe.id) return false;
                const itemTags = item.type === 'plant' ? item.benefits : item.tags;
                return recipe.tags.some(tag => itemTags.includes(tag));
            })
            .slice(0, 4);
    }, [recipe, allContent]);

    // Ensure tabs exist
    const tabs = recipe.tabs && recipe.tabs.length > 0 ? recipe.tabs : [];

    // JSON-LD for Recipe
    const recipeSchema = {
        "@type": "Recipe",
        "name": recipe.title,
        "description": recipe.summary,
        "image": recipe.imageUrl,
        "datePublished": recipe.date,
        "recipeCategory": "Health",
        "keywords": recipe.tags.join(', ')
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <SEO 
                title={recipe.title}
                description={recipe.summary}
                image={recipe.imageUrl}
                schema={recipeSchema}
            />

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`recipe-${recipe.id}`}
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

                {/* Image Side */}
                <div className="w-full md:w-5/12 h-64 md:h-full relative flex-shrink-0">
                    <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#8B4513]/20"></div>
                     
                     <div className="absolute bottom-4 right-4 left-4 z-20 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2 text-orange-200">
                             <ChefHat size={20}/>
                             <span className="font-bold text-sm">מתכון בריאות</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {recipe.tags.slice(0, 4).map((tag, i) => (
                                <span key={i} className="bg-black/30 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="text-white md:hidden pr-1 mt-1">
                            <h2 className="text-2xl font-bold leading-tight">{recipe.title}</h2>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-7/12 flex flex-col bg-[#FAF9F6] overflow-hidden relative rounded-t-3xl md:rounded-none -mt-4 md:mt-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">
                    
                    <div className="hidden md:block p-8 pb-0">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-white inline-block shadow-sm bg-orange-600 flex items-center gap-1">
                                <Utensils size={10} /> מתכון
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Calendar size={14} /> עודכן: {recipe.date}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-[#3E2723] leading-tight">{recipe.title}</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 px-4 md:px-8 mt-6 border-b border-gray-200 flex-shrink-0 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTabId('summary')}
                            className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTabId === 'summary' ? 'text-orange-800 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            על המתכון
                            {activeTabId === 'summary' && <motion.div layoutId="recipe-tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-orange-800" />}
                        </button>
                        
                        {tabs.map(tab => (
                             <button 
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTabId === tab.id ? 'text-orange-800 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.title}
                                {activeTabId === tab.id && <motion.div layoutId="recipe-tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-orange-800" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="p-6 md:p-8 pt-6 flex-grow min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {activeTabId === 'summary' ? (
                                    <motion.div
                                        key="summary"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="prose prose-lg prose-orange max-w-none text-gray-700 leading-relaxed font-light"
                                    >
                                        <p className="font-bold text-xl text-gray-800 mb-6">{recipe.summary}</p>
                                        
                                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm text-sm mt-8">
                                            <div className="flex items-center gap-3 text-orange-800 border-b border-orange-200 pb-2 mb-2">
                                                <Flame size={16} className="text-orange-500"/>
                                                <span className="font-bold">טיפ מהמטבח:</span>
                                            </div>
                                            <p className="text-gray-700 italic">
                                                שימוש בצמחי מרפא בבישול לא רק משפר את הטעם, אלא גם מוסיף ערך בריאותי משמעותי. מומלץ תמיד להשתמש בחומרי גלם טריים ואיכותיים.
                                            </p>
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
                                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                                            >
                                                <h3 className="text-xl font-bold mb-4 text-[#3E2723]">{tab.title}</h3>
                                                <div className="whitespace-pre-line">{tab.content}</div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                        
                         {relatedItems.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-200 p-8 mt-auto">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">מתכונים ותכנים נוספים</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default RecipeModal;