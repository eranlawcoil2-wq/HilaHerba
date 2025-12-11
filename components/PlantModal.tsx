import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, Droplet, AlertTriangle, BookOpen } from 'lucide-react';
import { Plant } from '../types';

interface PlantModalProps {
  plant: Plant;
  onClose: () => void;
}

const PlantModal: React.FC<PlantModalProps> = ({ plant, onClose }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'benefits' | 'usage'>('general');

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
                layoutId={`plant-${plant.id}`}
                className="bg-[#FAF9F6] w-full max-w-4xl h-[85vh] md:h-[600px] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row z-10"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 z-20 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Side (Desktop) / Top (Mobile) - Image */}
                <div className="w-full md:w-5/12 h-48 md:h-full relative">
                    <img 
                        src={plant.imageUrl} 
                        alt={plant.hebrewName} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1a2e1a]/20"></div>
                    <div className="absolute bottom-6 right-6 text-white md:hidden">
                        <h2 className="text-3xl font-serif font-bold">{plant.hebrewName}</h2>
                        <p className="text-green-100 italic">{plant.latinName}</p>
                    </div>
                </div>

                {/* Right Side - Content & Tabs */}
                <div className="w-full md:w-7/12 flex flex-col bg-[#FAF9F6]">
                    
                    {/* Header (Desktop only) */}
                    <div className="hidden md:block p-8 pb-0">
                         <h2 className="text-4xl font-serif font-bold text-[#1a2e1a] mb-1">{plant.hebrewName}</h2>
                         <p className="text-gray-500 italic font-serif text-lg">{plant.latinName}</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-6 px-8 mt-6 border-b border-gray-200">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'general' ? 'text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            כללי
                            {activeTab === 'general' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-green-800" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('benefits')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'benefits' ? 'text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            יתרונות רפואיים
                            {activeTab === 'benefits' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-green-800" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('usage')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'usage' ? 'text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            שימוש ובטיחות
                            {activeTab === 'usage' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 right-0 w-full h-0.5 bg-green-800" />}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div 
                                    key="general"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <BookOpen className="text-green-600 mt-1 flex-shrink-0" size={20} />
                                        <p className="text-gray-600 leading-relaxed text-lg">
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
                                </motion.div>
                            )}

                            {activeTab === 'benefits' && (
                                <motion.div 
                                    key="benefits"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Leaf className="text-green-600" size={20} />
                                        סגולות עיקריות
                                    </h3>
                                    <ul className="grid gap-3">
                                        {plant.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-50 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                <span className="text-gray-700">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                             {activeTab === 'usage' && (
                                <motion.div 
                                    key="usage"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Droplet className="text-blue-500" size={20} />
                                            אופן השימוש
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl">
                                            {plant.usage}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="text-amber-500" size={20} />
                                            בטיחות והתוויות נגד
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                            {plant.precautions}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PlantModal;