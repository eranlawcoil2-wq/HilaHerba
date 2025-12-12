import React from 'react';
import { Mail, Phone, MapPin, Send, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const { general } = useSite();

  const businessSchema = {
    "@type": "LocalBusiness",
    "name": general.siteName,
    "image": "https://picsum.photos/seed/portrait/600/800", // Using portrait from the page
    "telephone": general.phone,
    "email": general.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": general.address,
      "addressLocality": "Tel Aviv",
      "addressCountry": "IL"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <SEO 
        title="צור קשר" 
        description={`צרו קשר עם ${general.therapistName} לתיאום ייעוץ אישי בצמחי מרפא. הקליניקה נמצאת ב${general.address}.`}
        schema={businessSchema}
      />
      
      {/* About Section (Top) */}
      <section className="pt-32 pb-16 bg-[#1a2e1a] text-white relative overflow-hidden rounded-b-[3rem]">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                 <div className="w-full md:w-1/3">
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                        <img 
                            src="https://picsum.photos/seed/portrait/600/800" 
                            alt="Herbalist Portrait" 
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D2B48C] rounded-full flex flex-col items-center justify-center text-[#1a2e1a] text-center leading-tight shadow-xl p-2 z-20">
                            <Video size={20} className="mb-1 opacity-80" />
                            <span className="text-[10px] font-bold leading-tight">פגישות ייעוץ<br/>גם בזום</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/3 text-center md:text-right">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">נעים להכיר, אני {general.therapistName}</h1>
                    <div className="w-20 h-1 bg-green-500 mb-8 mx-auto md:mx-0"></div>
                    <p className="text-green-100 text-lg leading-relaxed mb-6 font-light whitespace-pre-line">
                        {general.aboutLong}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Contact Section (Bottom) */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl">
                
                {/* Info Side */}
                <div className="bg-[#2F4F2F] text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    
                    <div>
                        <h2 className="text-3xl font-bold mb-6">צור קשר</h2>
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
                                    <a href={`tel:${general.phone}`} className="text-gray-300 hover:text-white transition-colors hover:underline">{general.phone}</a>
                                    <p className="text-gray-400 text-sm mt-1">ימים א'-ה', 09:00 - 18:00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <Mail className="text-green-300" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">אימייל</h3>
                                    <a href={`mailto:${general.email}`} className="text-gray-300 hover:text-white transition-colors hover:underline">{general.email}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <MapPin className="text-green-300" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">קליניקה</h3>
                                    <p className="text-gray-300">{general.address}</p>
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
      </section>
    </div>
  );
};

export default Contact;