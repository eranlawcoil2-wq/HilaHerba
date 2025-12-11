import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#f4f1ea] -z-20"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#e8e4db] -z-10 rounded-l-[100px] hidden md:block"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 md:order-1 text-center md:text-right"
        >
          <span className="text-green-700 font-medium tracking-widest uppercase text-sm mb-4 block">
            רפואה טבעית ומסורתית
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1a2e1a] leading-tight mb-6">
            הטבע הוא <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-green-800 to-green-600">
              המרפא הטוב ביותר
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            גלו את הכוח המרפא של הצמחים. מאגר ידע מקיף, מאמרים מקצועיים וטיפול אישי המותאם לצרכים שלכם.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link 
              to="/plants" 
              className="px-8 py-4 bg-[#1a2e1a] text-white rounded-full font-medium hover:bg-green-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              אינדקס הצמחים
              <ArrowLeft size={18} />
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 border border-[#1a2e1a] text-[#1a2e1a] rounded-full font-medium hover:bg-[#1a2e1a] hover:text-white transition-all flex items-center justify-center"
            >
              תיאום ייעוץ
            </Link>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 md:order-2 relative h-[50vh] md:h-[70vh] w-full"
        >
          <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl">
             <img 
               src="https://picsum.photos/seed/herbalist/800/1200" 
               alt="Medicinal Plants" 
               className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Floating Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block"
          >
            <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <Leaf size={20} />
                </div>
                <div>
                    <p className="font-bold text-gray-800">הצמח החודשי</p>
                    <p className="text-sm text-gray-500">אכינצאה</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 leading-snug">
                ידוע בסגולותיו לחיזוק המערכת החיסונית בחילופי עונות.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;