import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLANTS, ARTICLES } from '../services/data';
import { ContentItem } from '../types';

interface GeneralSettings {
  siteName: string;
  therapistName: string;
  phone: string;
  email: string;
  address: string;
  aboutShort: string; // Used in Footer
  aboutLong: string;  // Used in Home/Contact "Nice to meet you"
}

interface SiteContextType {
  general: GeneralSettings;
  content: ContentItem[];
  updateGeneral: (settings: GeneralSettings) => void;
  addContent: (item: ContentItem) => void;
  updateContent: (item: ContentItem) => void;
  deleteContent: (id: string) => void;
}

const defaultGeneral: GeneralSettings = {
  siteName: 'Herbal Wisdom',
  therapistName: 'נעה',
  phone: '050-1234567',
  email: 'info@herbal.co.il',
  address: 'רחוב הירקון 12, תל אביב',
  aboutShort: 'מרכז ידע וטיפול בצמחי מרפא. מחברים את חוכמת העבר עם המדע של היום לטיפול טבעי ומותאם אישית.',
  aboutLong: `החיבור שלי לעולם הצמחים התחיל עוד בילדות, בטיולים בטבע ובליקוט צמחים עם סבתי. אני מאמינה שליקוט, הכנה ורקיחה הם חלק בלתי נפרד מתהליך הריפוי.

בקליניקה שלי אני משלבת ידע מסורתי עתיק עם הבנה מדעית מודרנית ופתולוגיה מערבית, כדי להעניק לגוף את הכלים המדויקים להם הוא זקוק כדי לרפא את עצמו. כל מטופל מקבל יחס אישי והתאמה של פורמולות ייחודיות.`
};

// Merge initial static data
const initialContent: ContentItem[] = [
  ...PLANTS.map(p => ({ ...p, type: 'plant' as const })),
  ...ARTICLES
];

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or use defaults
  const [general, setGeneral] = useState<GeneralSettings>(() => {
    const saved = localStorage.getItem('site_general');
    return saved ? JSON.parse(saved) : defaultGeneral;
  });

  const [content, setContent] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('site_content');
    return saved ? JSON.parse(saved) : initialContent;
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('site_general', JSON.stringify(general));
  }, [general]);

  useEffect(() => {
    localStorage.setItem('site_content', JSON.stringify(content));
  }, [content]);

  const updateGeneral = (settings: GeneralSettings) => {
    setGeneral(settings);
  };

  const addContent = (item: ContentItem) => {
    setContent(prev => [item, ...prev]);
  };

  const updateContent = (updatedItem: ContentItem) => {
    setContent(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SiteContext.Provider value={{ general, content, updateGeneral, addContent, updateContent, deleteContent }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};