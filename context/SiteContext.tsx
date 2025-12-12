import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLANTS, ARTICLES, SLIDES } from '../services/data';
import { ContentItem, Slide } from '../types';
import { supabase } from '../services/supabaseClient';
import { GoogleGenAI } from "@google/genai";

interface GeneralSettings {
  siteName: string;
  therapistName: string;
  phone: string;
  email: string;
  address: string;
  aboutShort: string;
  aboutLong: string;
  geminiKey?: string;
  unsplashKey?: string;
  adminNotes?: string;
}

interface SiteContextType {
  general: GeneralSettings;
  content: ContentItem[];
  slides: Slide[];
  loading: boolean;
  updateGeneral: (settings: GeneralSettings) => Promise<void>;
  addContent: (item: ContentItem) => Promise<void>;
  updateContent: (item: ContentItem) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  addSlide: (slide: Slide) => Promise<void>;
  updateSlide: (slide: Slide) => Promise<void>;
  deleteSlide: (id: string) => Promise<void>;
  generateAIContent: (prompt: string, type: 'text' | 'json') => Promise<string>;
  searchImages: (query: string) => Promise<any[]>;
  uploadImage: (file: File) => Promise<string | null>;
}

const defaultGeneral: GeneralSettings = {
  siteName: 'Herbal Wisdom',
  therapistName: 'נעה',
  phone: '050-1234567',
  email: 'info@herbal.co.il',
  address: 'רחוב הירקון 12, תל אביב',
  aboutShort: 'מרכז ידע וטיפול בצמחי מרפא.',
  aboutLong: 'ברוכים הבאים לאתר שלי...',
  geminiKey: '',
  unsplashKey: '',
  adminNotes: ''
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [general, setGeneral] = useState<GeneralSettings>(defaultGeneral);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Mappers ---
  const mapDbToContent = (dbItem: any): ContentItem => {
    // Parsing tabs if stored as JSONB, or defaulting to empty
    const tabs = dbItem.tabs || [];
    
    // Backward compatibility for old rows without 'tabs' column
    if (tabs.length === 0 && (dbItem.usage || dbItem.precautions || dbItem.content)) {
        if (dbItem.usage) tabs.push({ id: 'legacy-1', title: 'שימוש', content: dbItem.usage });
        if (dbItem.precautions) tabs.push({ id: 'legacy-2', title: 'בטיחות', content: dbItem.precautions });
        if (dbItem.content) tabs.push({ id: 'legacy-3', title: 'תוכן', content: dbItem.content });
    }

    if (dbItem.type === 'plant') {
      return {
        id: dbItem.id,
        type: 'plant',
        hebrewName: dbItem.hebrew_name,
        latinName: dbItem.latin_name,
        description: dbItem.description,
        benefits: dbItem.benefits || [],
        category: dbItem.category,
        imageUrl: dbItem.image_url,
        tabs: tabs
      };
    } else {
      return {
        id: dbItem.id,
        type: dbItem.type as 'article' | 'case_study',
        title: dbItem.title,
        summary: dbItem.summary,
        date: dbItem.date,
        tags: dbItem.tags || [],
        imageUrl: dbItem.image_url,
        tabs: tabs
      };
    }
  };

  const mapContentToDb = (item: ContentItem) => {
    // Common fields
    const base = {
      id: item.id,
      type: item.type,
      image_url: item.imageUrl,
      tabs: item.tabs
    };

    if (item.type === 'plant') {
      return {
        ...base,
        hebrew_name: item.hebrewName,
        latin_name: item.latinName,
        description: item.description,
        benefits: item.benefits,
        category: item.category,
        // Reset legacy fields to null if migrating
        usage: null,
        precautions: null
      };
    } else {
      return {
        ...base,
        title: item.title,
        summary: item.summary,
        date: item.date,
        tags: item.tags,
        // Reset legacy fields
        content: null
      };
    }
  };

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Settings
      const { data: settingsData } = await supabase.from('general_settings').select('*').single();
      if (settingsData) {
        setGeneral({
          siteName: settingsData.site_name,
          therapistName: settingsData.therapist_name,
          phone: settingsData.phone,
          email: settingsData.email,
          address: settingsData.address,
          aboutShort: settingsData.about_short,
          aboutLong: settingsData.about_long,
          geminiKey: settingsData.gemini_key || '',
          unsplashKey: settingsData.unsplash_key || '',
          adminNotes: settingsData.admin_notes || ''
        });
      }

      // 2. Content
      const { data: contentData } = await supabase.from('content').select('*').order('created_at', { ascending: false });
      if (contentData && contentData.length > 0) {
        setContent(contentData.map(mapDbToContent));
      } else {
        if (contentData && contentData.length === 0) {
             setContent([]);
        } else {
             setContent([...PLANTS.map(p => ({...p, type: 'plant' as const})), ...ARTICLES]);
        }
      }

      // 3. Slides
      const { data: slidesData } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
      if (slidesData && slidesData.length > 0) {
        setSlides(slidesData.map(s => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            text: s.text,
            image: s.image_url,
            active: s.is_active,
            order: s.display_order
        }) as Slide));
      } else {
          setSlides(SLIDES);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setContent([...PLANTS.map(p => ({...p, type: 'plant' as const})), ...ARTICLES]);
      setSlides(SLIDES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // --- Realtime Subscriptions ---
    const contentSub = supabase.channel('content-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, () => {
        fetchData(); 
      })
      .subscribe();
      
    const settingsSub = supabase.channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'general_settings' }, () => {
        fetchData();
      })
      .subscribe();

    const slidesSub = supabase.channel('slides-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(contentSub);
      supabase.removeChannel(settingsSub);
      supabase.removeChannel(slidesSub);
    };
  }, []);

  // --- Actions ---

  const updateGeneral = async (settings: GeneralSettings) => {
    setGeneral(settings);
    const dbSettings = {
      id: 1, 
      site_name: settings.siteName,
      therapist_name: settings.therapistName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      about_short: settings.aboutShort,
      about_long: settings.aboutLong,
      gemini_key: settings.geminiKey,
      unsplash_key: settings.unsplashKey,
      admin_notes: settings.adminNotes
    };
    const { error } = await supabase.from('general_settings').upsert(dbSettings);
    if (error) throw error;
  };

  const addContent = async (item: ContentItem) => {
    // Optimistic Update
    setContent(prev => [item, ...prev]);
    
    const dbItem = mapContentToDb(item);
    const { error } = await supabase.from('content').insert(dbItem);
    
    if (error) {
        // Rollback on error
        setContent(prev => prev.filter(c => c.id !== item.id));
        throw error;
    }
  };

  const updateContent = async (item: ContentItem) => {
     // Optimistic Update
     const oldContent = [...content];
     setContent(prev => prev.map(c => c.id === item.id ? item : c));
     
     const dbItem = mapContentToDb(item);
     const { error } = await supabase.from('content').update(dbItem).eq('id', item.id);
     
     if (error) {
         // Rollback
         setContent(oldContent);
         throw error;
     }
  };

  const deleteContent = async (id: string) => {
    // Optimistic Update
    const oldContent = [...content];
    setContent(prev => prev.filter(c => c.id !== id));
    
    const { error } = await supabase.from('content').delete().eq('id', id);
    if (error) {
        // Rollback
        setContent(oldContent);
        throw error;
    }
  };

  // --- Slides Actions ---
  const addSlide = async (slide: Slide) => {
      setSlides(prev => [...prev, slide]);
      const { error } = await supabase.from('hero_slides').insert({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          text: slide.text,
          image_url: slide.image,
          is_active: slide.active,
          display_order: slide.order
      });
      if (error) throw error;
  };

  const updateSlide = async (slide: Slide) => {
      setSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
      const { error } = await supabase.from('hero_slides').update({
          title: slide.title,
          subtitle: slide.subtitle,
          text: slide.text,
          image_url: slide.image,
          is_active: slide.active,
          display_order: slide.order
      }).eq('id', slide.id);
      if (error) throw error;
  };

  const deleteSlide = async (id: string) => {
      setSlides(prev => prev.filter(s => s.id !== id));
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
  };

  // --- AI & Images ---

  const generateAIContent = async (prompt: string, type: 'text' | 'json'): Promise<string> => {
    if (!general.geminiKey) throw new Error("חסר מפתח Gemini API בהגדרות");
    
    try {
        const ai = new GoogleGenAI({ apiKey: general.geminiKey });
        
        const config: any = {};

        if (type === 'json') {
            config.responseMimeType = 'application/json';
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config
        });
        
        if (!response.text) {
             throw new Error("המודל החזיר תשובה ריקה.");
        }
        
        return response.text;
    } catch (e: any) {
        console.error("AI Error:", e);
        let msg = e.message || "שגיאה לא ידועה";
        if (msg.includes('403') || msg.includes('API key')) msg = "מפתח API לא תקין או חסר הרשאות.";
        throw new Error(msg);
    }
  };

  const searchImages = async (query: string): Promise<any[]> => {
      if (!general.unsplashKey) return [];
      try {
          const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${general.unsplashKey}`);
          const data = await res.json();
          return data.results || [];
      } catch (e) {
          console.error("Unsplash Error:", e);
          return [];
      }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
      try {
          const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
          const { data, error } = await supabase.storage.from('public-images').upload(fileName, file);
          
          if (error) {
              console.error("Supabase Storage Error:", error);
              if (error.message.includes("row-level security")) {
                  alert("שגיאת הרשאות: עליך להריץ את קוד ה-SQL העדכני ב-Admin כדי לאפשר העלאת תמונות.");
              } else {
                  alert("שגיאה בהעלאה: " + error.message);
              }
              return null;
          }
          
          const { data: { publicUrl } } = supabase.storage.from('public-images').getPublicUrl(fileName);
          return publicUrl;
      } catch (e: any) {
          console.error("Upload Error:", e);
          alert("שגיאה בהעלאה: " + e.message);
          return null;
      }
  };

  return (
    <SiteContext.Provider value={{ 
        general, content, slides, loading, 
        updateGeneral, addContent, updateContent, deleteContent,
        addSlide, updateSlide, deleteSlide,
        generateAIContent, searchImages, uploadImage
    }}>
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