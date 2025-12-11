import React from 'react';
import { ARTICLES } from '../services/data';
import { motion } from 'framer-motion';
import { Calendar, User, Tag } from 'lucide-react';

const KnowledgeCenter: React.FC = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20 pt-32">
       <div className="container mx-auto px-6 mb-16">
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2e1a] mb-4 text-center">מרכז הידע</h1>
           <p className="text-center text-gray-600 max-w-2xl mx-auto">
               אוסף מאמרים מקצועיים, מחקרים ותיאורי מקרה מהקליניקה. 
               המידע נועד להעשיר את הידע שלכם על עולם הצמחים והבריאות הטבעית.
           </p>
       </div>

       <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl">
            {ARTICLES.map((article, index) => (
                <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                    <div className="h-64 relative overflow-hidden">
                        <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${
                                article.type === 'case_study' ? 'bg-blue-600/90' : 'bg-green-600/90'
                            }`}>
                                {article.type === 'case_study' ? 'מקרה בוחן' : 'מאמר'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                            <span className="flex items-center gap-1"><User size={12}/> מערכת Herbal</span>
                        </div>
                        
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 hover:text-green-700 transition-colors cursor-pointer">
                            {article.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                            {article.summary}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-auto">
                            {article.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded transition-colors hover:bg-gray-200 cursor-pointer">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-100">
                             <button className="text-green-700 font-bold text-sm tracking-wide uppercase hover:text-green-900 transition-colors">
                                 קרא את המאמר המלא &larr;
                             </button>
                        </div>
                    </div>
                </motion.article>
            ))}
       </div>
    </div>
  );
};

export default KnowledgeCenter;