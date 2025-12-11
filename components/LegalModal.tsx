import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, FileText, Activity } from 'lucide-react';

export type LegalType = 'privacy' | 'terms' | 'health' | null;

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

const CONTENT = {
  privacy: {
    title: 'מדיניות פרטיות',
    icon: <Shield size={24} className="text-green-600" />,
    text: `
      אנו ב-Herbal Wisdom מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך.
      
      1. איסוף מידע: אנו אוספים רק את המידע שאתה מספק לנו מרצונך החופשי בעת יצירת קשר (שם, טלפון, מייל).
      2. שימוש במידע: המידע ישמש אך ורק לצורך יצירת קשר חזרה ומתן שירות. לא נעביר את המידע לצד שלישי.
      3. אבטחת מידע: אנו נוקטים באמצעי זהירות מקובלים כדי לאבטח את המידע.
      4. עוגיות (Cookies): האתר עשוי להשתמש בעוגיות לצורך שיפור חווית המשתמש וסטטיסטיקה אנונימית.
    `
  },
  terms: {
    title: 'תנאי שימוש',
    icon: <FileText size={24} className="text-blue-600" />,
    text: `
      ברוכים הבאים לאתר Herbal Wisdom. השימוש באתר כפוף לתנאים הבאים:

      1. קניין רוחני: כל התכנים באתר (טקסטים, תמונות, עיצוב) הם רכושו הבלעדי של האתר ואין להעתיקם ללא אישור.
      2. שימוש הוגן: האתר נועד לשימוש אישי ולימודי. אין לעשות בו שימוש מסחרי ללא היתר.
      3. היעדר אחריות: השימוש במידע באתר הוא על אחריות המשתמש בלבד.
    `
  },
  health: {
    title: 'הצהרת בריאות',
    icon: <Activity size={24} className="text-red-600" />,
    text: `
      חשוב לקרוא לפני השימוש באתר:

      1. המידע המופיע באתר זה הינו למטרות לימודיות ואינפורמטיביות בלבד.
      2. התכנים אינם מהווים ייעוץ רפואי, חוות דעת מקצועית, אבחנה או המלצה לטיפול.
      3. המידע אינו מחליף התייעצות עם רופא או מטפל מוסמך.
      4. אין להסתמך על המידע באתר לצורך קבלת החלטות רפואיות או הפסקת טיפול תרופתי קיים.
      5. השימוש בצמחי מרפא דורש התאמה אישית וזהירות, במיוחד לנשים בהריון, מניקות, ילדים ונוטלי תרופות מרשם.
    `
  }
};

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = CONTENT[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-3">
              {content.icon}
              <h3 className="text-xl font-serif font-bold text-gray-800">{content.title}</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <p className="whitespace-pre-line text-gray-600 leading-relaxed">
                {content.text}
            </p>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-[#1a2e1a] text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
            >
                סגור
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalModal;