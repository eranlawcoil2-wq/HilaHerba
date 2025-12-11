import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl">
            
            {/* Info Side */}
            <div className="bg-[#1a2e1a] text-white p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-6">צור קשר</h2>
                    <p className="text-green-100 mb-12 leading-relaxed">
                        מעוניינים בייעוץ אישי? יש לכם שאלה לגבי אחד המאמרים?
                        אני כאן לכל שאלה. השאירו פרטים ואחזור אליכם בהקדם.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Phone className="text-green-300" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">טלפון</h3>
                                <p className="text-gray-300">050-1234567</p>
                                <p className="text-gray-400 text-sm">ימים א'-ה', 09:00 - 18:00</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Mail className="text-green-300" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">אימייל</h3>
                                <p className="text-gray-300">info@herbal.co.il</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <MapPin className="text-green-300" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">קליניקה</h3>
                                <p className="text-gray-300">רחוב הירקון 12, תל אביב</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 md:mt-0">
                    <p className="text-sm text-green-200">
                        * פגישות ייעוץ בתאום מראש בלבד
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="p-12">
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                            <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                        <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">נושא הפנייה</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white">
                            <option>ייעוץ בצמחי מרפא</option>
                            <option>שאלה כללית</option>
                            <option>הרצאות וסדנאות</option>
                            <option>אחר</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">הודעה</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"></textarea>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#1a2e1a] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20"
                    >
                        שלח הודעה <Send size={18} />
                    </motion.button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;