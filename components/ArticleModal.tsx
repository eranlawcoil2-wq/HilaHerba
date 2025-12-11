import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, User, Sprout, FileText } from 'lucide-react';
import { Article, ContentItem } from '../types';
import { PLANTS, ARTICLES } from '../services/data';
import { TYPE_LABELS } from '../constants';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  onSwitchItem?: (item: ContentItem) => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onSwitchItem }) => {
    
    // Calculate related items
    const relatedItems: ContentItem[] = useMemo(() => {
        const allContent: ContentItem[] = [
            ...PLANTS.map(p => ({ ...p, type: 'plant' as const })),
            ...ARTICLES
        ];

        return allContent
            .filter(item => {
                // Remove self
                if (item.type !== 'plant' && item.id === article.id) return false;
                
                // Get tags for comparison
                const itemTags = item.type === 'plant' ? item.benefits : item.tags;
                
                // Check for intersection
                return article.tags.some(tag => itemTags.includes(tag));
            })
            .slice(0, 4); // Limit to 4
    }, [article]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`article-${article.id}`}
                className="bg-[#FAF9F6] w-full max-w-4xl h-[90vh] md:h-[750px] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col z-10"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 z-20 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors shadow-sm"
                >
                    <X size={20} />
                </button>

                {/* Header Image */}
                <div className="w-full h-56 md:h-64 relative flex-shrink-0">
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] to-transparent"></div>
                    
                    <div className="absolute bottom-4 right-8 left-8">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white mb-3 inline-block shadow-sm ${
                            article.type === 'case_study' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                            {article.type === 'case_study' ? 'מקרה בוחן' : 'מאמר'}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#1a2e1a] leading-tight shadow-sm">
                            {article.title}
                        </h2>
                    </div>
                </div>

                {/* Content Container */}
                <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="p-8 pt-4 flex-grow">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-8 font-medium border-b border-gray-200 pb-4">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {article.date}</span>
                            <span className="flex items-center gap-1"><User size={14}/> מערכת Herbal</span>
                        </div>

                        <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed font-light">
                            <p className="font-bold text-xl text-gray-800 mb-6">{article.summary}</p>
                            <p>{article.content}</p>
                            <p>
                                כאן יופיע התוכן המלא של המאמר. כרגע זהו טקסט דמה כדי להמחיש את העיצוב.
                                הטקסט צריך להיות קריא, עם ריווח נעים לעין.
                                <br/><br/>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-12 pt-6 border-t border-gray-200">
                            {article.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                    <Tag size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Related Items Section */}
                    {relatedItems.length > 0 && (
                        <div className="bg-gray-50 border-t border-gray-200 p-8 mt-auto">
                            <h3 className="text-lg font-serif font-bold text-gray-800 mb-4">תכנים נוספים שעשויים לעניין אותך</h3>
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
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                        {item.type === 'plant' ? <Sprout size={8} /> : <FileText size={8} />}
                                                        {item.type === 'plant' ? item.benefits[0] : item.tags[0]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ArticleModal;