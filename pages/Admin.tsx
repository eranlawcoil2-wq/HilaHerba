import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { Save, Plus, Trash2, Edit2, Settings, FileText, LayoutDashboard, Database, Copy, Check, Image as ImageIcon, Sparkles, Upload, Search, X, MonitorPlay, StickyNote, Server, MapPin, Key, AlertTriangle, DownloadCloud, Lock, LogIn, HardDrive, RotateCcw, RefreshCw, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { ContentItem, Slide, Plant, Article, Recipe } from '../types';
import { PLANTS, ARTICLES, SLIDES as DEMO_SLIDES } from '../services/data';
import { supabaseUrl } from '../services/supabaseClient';

type Tab = 'general' | 'content' | 'slides' | 'connections';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { 
      general, updateGeneral, 
      content, addContent, updateContent, deleteContent,
      slides, addSlide, updateSlide, deleteSlide,
      generateAIContent, searchImages, uploadImage, restoreFromBackup
  } = useSite();

  // --- States ---
  const [generalForm, setGeneralForm] = useState(general);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sync form with context data when it loads from DB
  useEffect(() => {
      setGeneralForm(general);
  }, [general]);

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);
  
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);

  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Image Picker State
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'content' | 'slide' | null>(null);
  const [imagePickerMode, setImagePickerMode] = useState<'url' | 'upload' | 'search'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Accordion State for Instructions
  const [openInstruction, setOpenInstruction] = useState<'supabase_sql' | 'supabase_storage' | 'deploy' | null>('deploy');

  // Error Modal State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCopied, setErrorCopied] = useState(false);

  // --- Helpers ---
  const showError = (msg: string) => {
      setErrorMessage(msg);
  };

  const showSuccess = (msg: string) => {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      
      const dbEmail = general.adminEmail;
      const dbPass = general.adminPassword;
      
      const isDbMatch = loginEmail === dbEmail && loginPassword === dbPass;
      // Also allow the hardcoded requested credentials explicitly
      const isHardcodedMatch = loginEmail === 'hilatams@gmail.com' && loginPassword === '123qweAsd';

      if (isDbMatch || isHardcodedMatch) {
          setIsAuthenticated(true);
          setLoginError(false);
      } else {
          setLoginError(true);
      }
  };

  const handleForgotPassword = () => {
      const email = prompt("הכנס את כתובת האימייל שלך לשחזור:");
      
      if (email && email.trim().toLowerCase() === 'hilatams@gmail.com') {
          // Open mail client with pre-filled details securely sent to self
          const subject = "שחזור סיסמה - Herbal Wisdom";
          const body = "הסיסמה שלך למערכת הניהול היא:\n\n123qweAsd\n\nנא לשמור במקום בטוח ולמחוק את המייל הזה לאחר השימוש.";
          
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else if (email) {
          alert('אימייל זה אינו תואם לאימייל המערכת המוגדר.');
      }
  };

  const handleBackup = () => {
      const backupData = {
          date: new Date().toISOString(),
          general: general,
          content: content,
          slides: slides
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `herbal_wisdom_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess("הגיבוי ירד למחשב שלך בהצלחה!");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
          try {
              const json = e.target?.result as string;
              const backupData = JSON.parse(json);
              
              if (confirm("האם אתה בטוח שברצונך לשחזר את האתר מגיבוי זה? פעולה זו תדרוס נתונים קיימים.")) {
                  await restoreFromBackup(backupData);
                  showSuccess("האתר שוחזר בהצלחה!");
              }
          } catch (err: any) {
              showError("שגיאה בטעינת הגיבוי: הקובץ לא תקין או פגום.");
          } finally {
              if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
          }
      };
      reader.readAsText(file);
  };

  const handleGeneralSave = async () => {
    try {
        await updateGeneral(generalForm);
        showSuccess('הגדרות נשמרו בהצלחה!');
    } catch (error: any) {
        let msg = error.message || error.toString();
        
        // Specific handling for Schema Cache error
        if (msg.includes('schema cache') || msg.includes('Could not find the') || msg.includes('admin_email')) {
            msg = `שגיאת סנכרון מסד נתונים (Schema Cache).
            
הסיבה: האתר מנסה לשמור שדות חדשים (כמו admin_email) אבל ה-Supabase עדיין לא "קלט" שהם קיימים, למרות שהרצת את ה-SQL.

פתרונות (נסה לפי הסדר):
1. רענן את העמוד הזה (F5) ונסה לשמור שוב.
2. וודא שאתה מריץ את ה-SQL באותו פרויקט שהאתר מחובר אליו (בדוק את כתובת הפרויקט בטאב 'חיבורים').
3. פתרון קסם: כנס ל-Supabase -> Settings -> Infrastructure -> לחץ על "Restart Project". זה ינקה את הזיכרון ויפתור את הבעיה מיידית.

הודעה טכנית: ${msg}`;
        }

        showError(msg);
    }
  };

  const handleLoadDemoData = async () => {
    if (!confirm('האם להטעין את נתוני ההדגמה (צמחים, מאמרים, שקופיות) למסד הנתונים?')) return;
    setIsLoadingDemo(true);
    try {
        let count = 0;
        // Add Slides
        for (const slide of DEMO_SLIDES) {
             if (!slides.some(s => s.id === slide.id)) {
                 await addSlide(slide);
                 count++;
             }
        }
        // Add Content
        for (const plant of PLANTS) {
            const item = { ...plant, type: 'plant' as const };
             if (!content.some(c => c.id === item.id)) {
                 await addContent(item);
                 count++;
             }
        }
        for (const article of ARTICLES) {
             if (!content.some(c => c.id === article.id)) {
                 await addContent(article as ContentItem);
                 count++;
             }
        }
        showSuccess(`התהליך הסתיים. ${count} פריטים נוספו בהצלחה!`);
    } catch (e: any) {
        showError('שגיאה בטעינת נתונים: ' + e.message);
    } finally {
        setIsLoadingDemo(false);
    }
  };

  const handleCreateNewContent = () => {
    setEditingItem({
      id: Date.now().toString(),
      type: 'plant',
      imageUrl: 'https://picsum.photos/seed/new/600/800',
      hebrewName: '',
      latinName: '',
      description: '',
      benefits: [],
      category: 'general',
      tabs: [],
      date: new Date().toISOString().split('T')[0] // Default to today
    });
    setIsEditingContent(true);
  };

  const handleCreateNewSlide = () => {
      setEditingSlide({
          id: Date.now().toString(),
          title: '',
          subtitle: '',
          text: '',
          image: 'https://picsum.photos/seed/slide/1200/800',
          active: true,
          order: slides.length + 1
      });
      setIsEditingSlide(true);
  };

  const handleSaveContent = async () => {
    if (!editingItem) return;
    if (editingItem.type === 'plant' && !(editingItem as Plant).hebrewName) return alert('נא למלא שם צמח');
    if (editingItem.type !== 'plant' && !(editingItem as Article).title) return alert('נא למלא כותרת');

    // Ensure tabs array exists
    const finalItem = { ...editingItem, tabs: editingItem.tabs || [] } as ContentItem;

    try {
        if (content.some(c => c.id === finalItem.id)) {
            await updateContent(finalItem);
        } else {
            await addContent(finalItem);
        }
        setIsEditingContent(false);
        setEditingItem(null);
        showSuccess('התוכן נשמר בהצלחה!');
    } catch (e: any) {
        showError('שגיאה בשמירה:\n' + (e.message || e.toString()) + '\n\nוודא שהרשאות ה-SQL הופעלו ב-Supabase.');
    }
  };

  const handleSaveSlide = async () => {
      if (!editingSlide) return;
      if (!editingSlide.title) return alert('חובה להזין כותרת');
      
      const finalSlide = editingSlide as Slide;
      try {
          if (slides.some(s => s.id === finalSlide.id)) {
              await updateSlide(finalSlide);
          } else {
              await addSlide(finalSlide);
          }
          setIsEditingSlide(false);
          setEditingSlide(null);
          showSuccess('שקופית נשמרה בהצלחה!');
      } catch (e: any) {
          showError('שגיאה בשמירה:\n' + (e.message || e.toString()));
      }
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('האם אתה בטוח?')) {
        deleteContent(id).catch(e => showError('שגיאה במחיקה: ' + e.message));
    }
  };

  const handleDeleteSlide = (id: string) => {
      if (confirm('למחוק שקופית זו?')) {
          deleteSlide(id).catch(e => showError('שגיאה במחיקה: ' + e.message));
      }
  };

  // --- AI Logic ---
  const handleAI = async (targetField: string, promptBase: string) => {
      if (!general.geminiKey) return showError("שגיאה: חסר מפתח Gemini. נא להגדיר בטאב 'חיבורים' ולשמור.");
      setAiLoading(true);
      try {
          // Enhancing the prompt for quality
          const enhancedPrompt = `
            You are a senior professional herbalist and editor. 
            The user needs a high-quality, professional, and detailed text for the field: "${targetField}".
            
            Context: ${promptBase}.
            
            Instructions:
            1. Write in Hebrew (unless asked for Latin name).
            2. Be professional, academic yet accessible.
            3. Do not use asterisks or markdown formatting if it's a simple text field.
            4. Provide deep insight, not just a summary.
          `;
          const res = await generateAIContent(enhancedPrompt, 'text');
          if (!res) throw new Error("התקבל תוכן ריק");
          
          if (isEditingContent && editingItem) {
             setEditingItem(prev => ({ ...prev, [targetField]: res }));
          } else if (isEditingSlide && editingSlide) {
             setEditingSlide(prev => ({ ...prev, [targetField]: res }));
          }
      } catch (e: any) {
          console.error("AI Text Error:", e);
          let errorMsg = e.message || e.toString();
          
          if (errorMsg.includes('503') || errorMsg.includes('overloaded')) {
              errorMsg = "השרתים של גוגל עמוסים כרגע (שגיאה 503).\nזה קורה לעיתים במודלים חינמיים.\nאנא המתן דקה ונסה שוב.";
          }
          
          showError(`שגיאה:\n${errorMsg}`);
      } finally {
          setAiLoading(false);
      }
  };

  const handleAutoTabs = async () => {
      if (!editingItem || !general.geminiKey) return showError("חסר מפתח AI או פריט לעריכה. וודא שהמפתח נשמר בטאב 'חיבורים'.");
      setAiLoading(true);
      
      let subject = editingItem.type === 'plant' ? (editingItem as Plant).hebrewName : (editingItem as Article).title;
      // Removed unused userPrompt variable

      // If no name is provided, ask the user or pick random
      if (!subject) {
          const userSubject = prompt("לא הוזן שם או כותרת. על מה תרצה שה-AI יכתוב?\n(השאר ריק כדי שה-AI יבחר נושא מעניין באופן אקראי)");
          if (userSubject === null) {
              setAiLoading(false);
              return; // User cancelled
          }
          subject = userSubject.trim() || "random_popular_topic";
      }
      
      let aiPrompt = "";
      
      // --- PLANT PROMPT ---
      if (editingItem.type === 'plant') {
          aiPrompt = `
            You are a world-renowned expert in Clinical Herbal Medicine (Herbalist).
            Task: Create a FULL profile for the medicinal plant: "${subject}".
            
            If the subject is "random_popular_topic", choose a popular medicinal plant that is commonly used.

            Output strictly a valid JSON object with these fields:
            {
                "hebrewName": "The plant name in Hebrew",
                "latinName": "Scientific/Latin name",
                "description": "A short, professional description (2-3 sentences) in Hebrew",
                "imageSearchQuery": "A precise and simple English search term to find a photo of this plant on Unsplash (e.g. 'Chamomile flower', 'Ginger root')",
                "benefits": ["tag1", "tag2", "tag3", "tag4"],
                "tabs": [
                    { "title": "Short Title (1-2 words)", "content": "Full detailed content in Hebrew..." }
                ]
            }

            Rules:
            1. "benefits": Provide EXACTLY 4 highly relevant short tags/benefits in Hebrew.
            2. "tabs": Create between 3 to 5 tabs.
            3. Tab Titles: Must be very short (e.g., "פעילות", "שימושים", "בטיחות", "מינון"). Do not use long titles.
            4. Content: Professional, accurate, and safe.
            5. Output ONLY the JSON. No markdown ticks.
          `;
      } 
      // --- RECIPE PROMPT ---
      else if (editingItem.type === 'recipe') {
          aiPrompt = `
            You are a Holistic Nutritionist and Chef.
            Task: Create a healthy, herbal-infused recipe for: "${subject}".
            
            If the subject is "random_popular_topic", choose a popular healthy dish or herbal remedy.

            Output strictly a valid JSON object with these fields:
            {
                "title": "A catchy, professional recipe title in Hebrew",
                "summary": "A short appetizing description (2-3 sentences) in Hebrew explaining the health benefits.",
                "imageSearchQuery": "A precise and simple English search term to find a photo of this dish on Unsplash (e.g. 'Pumpkin Soup', 'Green Smoothie')",
                "tags": ["tag1", "tag2", "tag3", "tag4"],
                "tabs": [
                    { "title": "מצרכים", "content": "List of ingredients in Hebrew" },
                    { "title": "אופן ההכנה", "content": "Step by step instructions in Hebrew" },
                    { "title": "ערכים תזונתיים", "content": "Short nutritional info in Hebrew" }
                ]
            }

            Rules:
            1. "tags": Provide EXACTLY 4 relevant tags in Hebrew (e.g., "טבעוני", "ללא גלוטן").
            2. "tabs": Create exactly 3 tabs as described.
            3. Content: Tasty, healthy, and accurate.
            5. Output ONLY the JSON. No markdown ticks.
          `;
      }
      // --- ARTICLE / CASE STUDY PROMPT ---
      else {
          const type = editingItem.type === 'case_study' ? 'Case Study' : 'Professional Article';
          aiPrompt = `
            You are a senior editor of a prestigious Herbal Medicine Journal.
            Task: Write a full ${type} about: "${subject}".
            
            If the subject is "random_popular_topic", choose an interesting professional topic or common clinical case.

            Output strictly a valid JSON object with these fields:
            {
                "title": "A catchy, professional title in Hebrew",
                "summary": "A short summary/abstract (2-3 sentences) in Hebrew",
                "imageSearchQuery": "A precise and simple English search term to find a photo related to this topic on Unsplash (e.g. 'Healthy food', 'Stressed woman', 'Herbal tea')",
                "tags": ["tag1", "tag2", "tag3", "tag4"],
                "tabs": [
                    { "title": "Short Title (1-2 words)", "content": "Full detailed content in Hebrew..." }
                ]
            }

            Rules:
            1. "tags": Provide EXACTLY 4 relevant tags in Hebrew.
            2. "tabs": Create between 3 to 5 tabs.
            3. Tab Titles: Must be very short (e.g., "מבוא", "אבחנה", "טיפול", "דיון").
            4. Content: Deep, professional, and educational.
            5. Output ONLY the JSON. No markdown ticks.
          `;
      }
      
      let rawRes = ""; // Capture raw output for debugging

      try {
          const res = await generateAIContent(aiPrompt, 'json');
          rawRes = res;
          
          // Robust JSON extraction
          let jsonString = res.replace(/```json/g, '').replace(/```/g, '').trim();
          
          // Find the object braces
          const firstBrace = jsonString.indexOf('{');
          const lastBrace = jsonString.lastIndexOf('}');
          
          if (firstBrace !== -1 && lastBrace !== -1) {
              jsonString = jsonString.substring(firstBrace, lastBrace + 1);
          }
          
          const aiData = JSON.parse(jsonString);
          
          // Map AI Data back to the Item State
          const newTabs = (aiData.tabs || []).map((t: any, i: number) => ({
              id: Date.now().toString() + i,
              title: t.title,
              content: t.content
          }));

          // 1. UPDATE TEXT CONTENT & DATE
          setEditingItem(prev => {
              if (!prev) return null;
              const newItem = { ...prev };
              
              // Set date to today!
              newItem.date = new Date().toISOString().split('T')[0];

              if (prev.type === 'plant') {
                  (newItem as Plant).hebrewName = aiData.hebrewName || (prev as Plant).hebrewName;
                  (newItem as Plant).latinName = aiData.latinName || (prev as Plant).latinName;
                  (newItem as Plant).description = aiData.description || (prev as Plant).description;
                  (newItem as Plant).benefits = aiData.benefits || (prev as Plant).benefits || [];
              } else {
                  (newItem as Article).title = aiData.title || (prev as Article).title;
                  (newItem as Article).summary = aiData.summary || (prev as Article).summary;
                  (newItem as Article).tags = aiData.tags || (prev as Article).tags || [];
              }
              
              newItem.tabs = newTabs;
              return newItem;
          });

          // 2. AUTO-SELECT IMAGE (If Query Exists and Unsplash Key is set)
          if (aiData.imageSearchQuery && general.unsplashKey) {
              try {
                  const images = await searchImages(aiData.imageSearchQuery);
                  if (images && images.length > 0) {
                      const bestImage = images[0].urls.regular;
                      setEditingItem(prev => prev ? ({ ...prev, imageUrl: bestImage }) : null);
                  }
              } catch (imgErr) {
                  console.warn("Auto image fetch failed:", imgErr);
              }
          }
          
          showSuccess("התוכן נוצר בהצלחה!");

      } catch (e: any) {
          console.error("AI Auto Content Error:", e);
          let errorMsg = e.message || e.toString();
          
          // Custom friendly error messages
          if (errorMsg.includes('503') || errorMsg.includes('overloaded') || errorMsg.includes('UNAVAILABLE')) {
              errorMsg = "השרתים של גוגל עמוסים כרגע (שגיאה 503).\nזה קורה לעיתים במודלים חינמיים כאשר יש עומס עולמי.\n\nאנא המתן דקה-שתיים ונסה שוב.";
          } else if (errorMsg.includes('SyntaxError') || errorMsg.includes('JSON')) {
              errorMsg = "המודל החזיר תשובה בפורמט לא תקין.\nלפעמים זה קורה באופן אקראי. אנא נסה ללחוץ שוב.";
              if (rawRes) {
                 errorMsg += `\n\n--- מידע טכני להעתקה (Raw Output) ---\n${rawRes.substring(0, 500)}${rawRes.length > 500 ? '...' : ''}`;
              }
          } else if (errorMsg.includes('403') || errorMsg.includes('key')) {
              errorMsg = "מפתח ה-API אינו תקין או שנחסם.\nבדוק את ההגדרות בטאב 'חיבורים' וודא שהעתקת את המפתח במלואו.";
          }
          
          showError(`הודעת מערכת:\n${errorMsg}`);
      } finally {
          setAiLoading(false);
      }
  };

  // --- Auto Generate Slide Logic ---
  const handleAutoSlide = async () => {
      if (!editingSlide || !general.geminiKey) return showError("חסר מפתח AI או שקופית לעריכה.");
      setAiLoading(true);

      let subject = editingSlide.title;
      if (!subject) {
          const userSubject = prompt("על מה תרצה שהשקופית תדבר?\n(לדוגמה: רוגע, טבע, בריאות, צמחים)");
          if (userSubject === null) {
              setAiLoading(false);
              return;
          }
          subject = userSubject.trim() || "nature healing";
      }

      const aiPrompt = `
        You are a web designer creating content for a Herbalist website Hero Slider.
        Task: Create a beautiful, inspiring slide about: "${subject}".

        Output strictly a valid JSON object:
        {
            "title": "Inspiring Short Title (Hebrew)",
            "subtitle": "Short Subtitle (1-2 words, Hebrew)",
            "text": "A short, poetic, and inviting paragraph (Hebrew, max 2 sentences).",
            "imageSearchQuery": "A precise English search term for Unsplash (e.g. 'Misty Forest', 'Hands holding herbs')"
        }
      `;

      try {
          const res = await generateAIContent(aiPrompt, 'json');
          const jsonString = res.replace(/```json/g, '').replace(/```/g, '').trim();
          const aiData = JSON.parse(jsonString.substring(jsonString.indexOf('{'), jsonString.lastIndexOf('}') + 1));

          setEditingSlide(prev => ({
              ...prev,
              title: aiData.title,
              subtitle: aiData.subtitle,
              text: aiData.text
          }));

          if (aiData.imageSearchQuery && general.unsplashKey) {
              const images = await searchImages(aiData.imageSearchQuery);
              if (images && images.length > 0) {
                  setEditingSlide(prev => prev ? ({ ...prev, image: images[0].urls.regular }) : null);
              }
          }
          showSuccess("השקופית נוצרה בהצלחה!");

      } catch (e: any) {
          showError(`שגיאה ביצירת שקופית:\n${e.message}`);
      } finally {
          setAiLoading(false);
      }
  };

  // --- Image Picker Logic ---
  const handleImageSearch = async () => {
      if (!general.unsplashKey) return showError("חסר מפתח Unsplash בהגדרות");
      const results = await searchImages(searchQuery);
      setSearchResults(results);
  };

  const selectImage = (url: string) => {
      if (imagePickerTarget === 'content' && editingItem) {
          setEditingItem({ ...editingItem, imageUrl: url });
      } else if (imagePickerTarget === 'slide' && editingSlide) {
          setEditingSlide({ ...editingSlide, image: url });
      }
      setShowImagePicker(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = await uploadImage(e.target.files[0]);
          if (url) {
              selectImage(url);
          } else {
              // Error handled in uploadImage
          }
      }
  };

  const sqlCode = `-- 1. יצירת טבלאות (אם לא קיימות)
create table if not exists content (
  id text primary key,
  type text,
  hebrew_name text,
  latin_name text,
  description text,
  benefits text[],
  category text,
  image_url text,
  title text,
  summary text,
  date text,
  tags text[],
  tabs jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists hero_slides (
  id text primary key,
  title text,
  subtitle text,
  text text,
  image_url text,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists general_settings (
  id int primary key default 1,
  site_name text,
  therapist_name text,
  phone text,
  email text,
  address text,
  about_short text,
  about_long text,
  gemini_key text,
  unsplash_key text,
  admin_notes text,
  admin_email text,
  admin_password text
);

-- 2. עדכון טבלאות קיימות (הוספת עמודות חסרות)
alter table general_settings add column if not exists admin_email text;
alter table general_settings add column if not exists admin_password text;
alter table general_settings add column if not exists address text;

-- 3. איפוס הגדרות ברירת מחדל
insert into general_settings (id, site_name, therapist_name, phone, email, address, admin_email, admin_password)
values (1, 'Herbal Wisdom', 'נעה', '050-1234567', 'info@herbal.co.il', 'רחוב הירקון 12, תל אביב', 'admin@herbal.co.il', 'admin123')
on conflict (id) do update set
  admin_email = 'admin@herbal.co.il',
  admin_password = 'admin123';

-- 4. הפעלת Realtime
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'content') then
    alter publication supabase_realtime add table content;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'general_settings') then
    alter publication supabase_realtime add table general_settings;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'hero_slides') then
    alter publication supabase_realtime add table hero_slides;
  end if;
end $$;

-- 5. הרשאות גישה (Row Level Security)
alter table content enable row level security;
alter table hero_slides enable row level security;
alter table general_settings enable row level security;

drop policy if exists "Public Read Content" on content;
drop policy if exists "Public Write Content" on content;
drop policy if exists "Public Update Content" on content;
drop policy if exists "Public Delete Content" on content;

drop policy if exists "Public Read Slides" on hero_slides;
drop policy if exists "Public Write Slides" on hero_slides;
drop policy if exists "Public Update Slides" on hero_slides;
drop policy if exists "Public Delete Slides" on hero_slides;

drop policy if exists "Public Read Settings" on general_settings;
drop policy if exists "Public Write Settings" on general_settings;
drop policy if exists "Public Update Settings" on general_settings;

create policy "Public Read Content" on content for select using (true);
create policy "Public Write Content" on content for insert with check (true);
create policy "Public Update Content" on content for update using (true);
create policy "Public Delete Content" on content for delete using (true);

create policy "Public Read Slides" on hero_slides for select using (true);
create policy "Public Write Slides" on hero_slides for insert with check (true);
create policy "Public Update Slides" on hero_slides for update using (true);
create policy "Public Delete Slides" on hero_slides for delete using (true);

create policy "Public Read Settings" on general_settings for select using (true);
create policy "Public Write Settings" on general_settings for insert with check (true);
create policy "Public Update Settings" on general_settings for update using (true);

-- 6. הרשאות לתמונות
do $$
begin
    insert into storage.buckets (id, name, public) 
    values ('public-images', 'public-images', true)
    on conflict (id) do nothing;
end $$;

drop policy if exists "Public Images Read" on storage.objects;
drop policy if exists "Public Images Upload" on storage.objects;

create policy "Public Images Read" on storage.objects for select using ( bucket_id = 'public-images' );
create policy "Public Images Upload" on storage.objects for insert with check ( bucket_id = 'public-images' );

-- 7. רענון Cache חובה! (מתקן את שגיאת ה-Schema Cache)
NOTIFY pgrst, 'reload config';
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center mb-8">
                      <div className="bg-[#1a2e1a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Lock className="text-white" size={32} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">כניסה לניהול המערכת</h2>
                      <p className="text-gray-500 mt-2 text-sm">אנא הזן את פרטי ההתחברות שלך</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">אימייל</label>
                          <input 
                            type="email" 
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all ltr"
                            placeholder="admin@herbal.co.il"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">סיסמה</label>
                          <input 
                            type="password" 
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all ltr"
                            placeholder="••••••••"
                          />
                      </div>
                      
                      {loginError && (
                          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                              <AlertTriangle size={16} />
                              פרטי התחברות שגויים. נסה שנית.
                          </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-[#1a2e1a] text-white py-3 rounded-xl font-bold hover:bg-green-900 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      >
                         <LogIn size={20} /> התחבר
                      </button>
                  </form>
                  
                  {/* Forgot Password Link */}
                  <div className="mt-6 text-center">
                    <button 
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                        <HelpCircle size={14} /> שכחתי סיסמה
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-gray-200 p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-8 text-[#1a2e1a] flex items-center gap-2">
            <LayoutDashboard size={24} />
            ניהול אתר
        </h2>
        <nav className="flex flex-col gap-2">
            {[
                { id: 'general', label: 'הגדרות כלליות', icon: Settings },
                { id: 'slides', label: 'ניהול סליידר', icon: MonitorPlay },
                { id: 'content', label: 'ניהול תכנים', icon: FileText },
                { id: 'connections', label: 'חיבורים וגיבוי', icon: Database },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === item.id ? 'bg-[#1a2e1a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <item.icon size={20} />
                    {item.label}
                </button>
            ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-grow p-6 md:p-12">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
            <div className="max-w-3xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">הגדרות כלליות</h3>
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">שם האתר</label>
                                <input type="text" value={generalForm.siteName} onChange={e => setGeneralForm({...generalForm, siteName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">שם המטפלת</label>
                                <input type="text" value={generalForm.therapistName} onChange={e => setGeneralForm({...generalForm, therapistName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">טלפון</label>
                                <input type="text" value={generalForm.phone} onChange={e => setGeneralForm({...generalForm, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">אימייל (פניות)</label>
                                <input type="text" value={generalForm.email} onChange={e => setGeneralForm({...generalForm, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                        {/* NEW ADDRESS FIELD */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">כתובת הקליניקה</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={generalForm.address} 
                                    onChange={e => setGeneralForm({...generalForm, address: e.target.value})} 
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">אודות (קצר)</label>
                            <textarea value={generalForm.aboutShort} onChange={e => setGeneralForm({...generalForm, aboutShort: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">אודות (מלא)</label>
                            <textarea value={generalForm.aboutLong} onChange={e => setGeneralForm({...generalForm, aboutLong: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={5} />
                        </div>
                    </div>

                    <button onClick={handleGeneralSave} className="bg-[#1a2e1a] text-white px-8 py-3 rounded-lg font-bold flex gap-2"><Save size={18}/> שמור הכל</button>
                </div>
            </div>
        )}

        {/* SLIDES TAB */}
        {activeTab === 'slides' && (
             <div className="max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                     <h3 className="text-3xl font-bold text-gray-800">ניהול סליידר (Hero)</h3>
                     <button onClick={handleCreateNewSlide} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> הוסף שקופית</button>
                </div>
                
                {!isEditingSlide ? (
                    <div className="grid gap-4">
                        {slides.map(slide => (
                            <div key={slide.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                                <img src={slide.image} className="w-24 h-16 object-cover rounded-lg" alt="" />
                                <div className="flex-grow">
                                    <h4 className="font-bold">{slide.title}</h4>
                                    <p className="text-sm text-gray-500">{slide.subtitle}</p>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={() => {setEditingSlide(slide); setIsEditingSlide(true);}} className="p-2 text-blue-600 bg-blue-50 rounded"><Edit2 size={16}/></button>
                                     <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 text-red-600 bg-red-50 rounded"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-xl">עריכת שקופית</h4>
                            <button 
                                onClick={handleAutoSlide} 
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-purple-700"
                                disabled={aiLoading}
                            >
                                {aiLoading ? 'חושב...' : <><Sparkles size={16}/> צור שקופית מלאה (AI)</>}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block font-bold text-sm mb-1">כותרת ראשית</label>
                                    <input type="text" value={editingSlide?.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full border p-2 rounded" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block font-bold text-sm mb-1">כותרת משנה</label>
                                <input type="text" value={editingSlide?.subtitle} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full border p-2 rounded" />
                            </div>

                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block font-bold text-sm mb-1">טקסט תיאור</label>
                                    <textarea value={editingSlide?.text} onChange={e => setEditingSlide({...editingSlide, text: e.target.value})} className="w-full border p-2 rounded" rows={3} />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 border p-4 rounded-lg">
                                <img src={editingSlide?.image} className="w-32 h-24 object-cover rounded" alt=""/>
                                <div className="flex-grow">
                                    <label className="block font-bold text-sm mb-1">כתובת תמונה</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={editingSlide?.image} onChange={e => setEditingSlide({...editingSlide, image: e.target.value})} className="w-full border p-2 rounded ltr" />
                                        <button 
                                            onClick={() => { setImagePickerTarget('slide'); setShowImagePicker(true); }}
                                            className="bg-gray-100 px-4 rounded hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <ImageIcon size={18}/> בחר תמונה
                                        </button>
                                    </div>
                                </div>
                            </div>

                             <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={editingSlide?.active} onChange={e => setEditingSlide({...editingSlide, active: e.target.checked})} />
                                    פעיל
                                </label>
                                <label className="flex items-center gap-2">
                                    סדר תצוגה:
                                    <input type="number" className="border w-16 p-1 rounded" value={editingSlide?.order} onChange={e => setEditingSlide({...editingSlide, order: parseInt(e.target.value)})} />
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={handleSaveSlide} className="bg-green-600 text-white px-6 py-2 rounded font-bold">שמור</button>
                                <button onClick={() => setIsEditingSlide(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-bold">ביטול</button>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === 'connections' && (
            <div className="max-w-4xl">
                <h3 className="text-3xl font-bold mb-6">חיבורים, גיבויים והגדרות טכניות</h3>
                
                {/* Connection Status Box */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                     <h4 className="font-bold text-xl mb-4 text-gray-800 flex items-center gap-2"><LinkIcon size={20}/> סטטוס חיבור</h4>
                     <div className="flex items-center gap-4 text-sm text-gray-600">
                         <div className={`w-3 h-3 rounded-full ${supabaseUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                         <span>
                             {supabaseUrl ? (
                                 <>
                                     מחובר לפרויקט: <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all">{supabaseUrl}</span>
                                 </>
                             ) : (
                                 'לא מחובר (חסרים מפתחות)'
                             )}
                         </span>
                     </div>
                     <p className="text-xs text-gray-400 mt-2">
                         וודא שאתה מריץ את קוד ה-SQL באותו פרויקט שמופיע כאן.
                     </p>
                </div>

                {/* NEW BACKUP SECTION */}
                <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-200 mb-8">
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3 text-blue-800">
                             <HardDrive size={24} />
                             <h4 className="font-bold text-xl">גיבוי ושחזור נתונים</h4>
                        </div>
                     </div>
                     <p className="text-blue-700 text-sm mb-4 max-w-xl">
                         ניתן להוריד גיבוי מלא של האתר למחשב, או לשחזר את האתר מקובץ גיבוי קיים.
                     </p>
                     
                     <div className="flex gap-4 flex-wrap">
                        <button 
                            onClick={handleBackup}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                        >
                            <DownloadCloud size={20} /> הורד גיבוי (JSON)
                        </button>

                        <div className="relative">
                            <input 
                                type="file" 
                                accept=".json" 
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                            >
                                <RotateCcw size={20} /> שחזר מגיבוי
                            </button>
                        </div>
                     </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* ... (API Key inputs) ... */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-xl mb-4 text-purple-700 flex items-center gap-2"><Key size={20}/> מפתחות (AI ותמונות)</h4>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold text-gray-800">Gemini API Key</label>
                                        {general.geminiKey ? <Check size={16} className="text-green-600"/> : <X size={16} className="text-red-500"/>}
                                    </div>
                                    <input type="password" className="w-full border p-2 rounded bg-white" placeholder="AIzaSy..." value={generalForm.geminiKey} onChange={e => setGeneralForm({...generalForm, geminiKey: e.target.value})} />
                                    {!general.geminiKey && <p className="text-xs text-red-500 mt-1">חסר! ה-AI לא יעבוד.</p>}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold text-gray-800">Unsplash Key</label>
                                        {general.unsplashKey ? <Check size={16} className="text-green-600"/> : <X size={16} className="text-red-500"/>}
                                    </div>
                                    <input type="password" className="w-full border p-2 rounded bg-white" value={generalForm.unsplashKey} onChange={e => setGeneralForm({...generalForm, unsplashKey: e.target.value})} />
                                </div>
                                <button onClick={handleGeneralSave} className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-purple-700">שמור מפתחות</button>
                            </div>
                        </div>
                        {/* Notes */}
                        <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-200">
                             <div className="flex justify-between items-start mb-3">
                                 <h4 className="font-bold text-xl flex items-center gap-2 text-yellow-800"><StickyNote size={20}/> תזכורות ופרטי התחברות</h4>
                                 <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-bold">אישי בלבד</span>
                             </div>
                             <p className="text-sm text-yellow-700 mb-3">המידע כאן נשמר בבסיס הנתונים ומוצג רק לך בדף הניהול.</p>
                             <textarea 
                                className="w-full border border-yellow-300 p-4 rounded-xl bg-white text-gray-800 min-h-[250px] shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-base font-mono"
                                placeholder="כתוב כאן הערות, סיסמאות או משימות..."
                                value={generalForm.adminNotes}
                                onChange={e => setGeneralForm({...generalForm, adminNotes: e.target.value})}
                             />
                             <div className="mt-4 flex justify-end">
                                <button onClick={handleGeneralSave} className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-yellow-700 transition-colors flex items-center gap-2">
                                    <Save size={16} /> שמור הערות
                                </button>
                             </div>
                        </div>
                    </div>
                    {/* Database Instructions */}
                    <div className="space-y-6">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-800"><Database size={20}/> מדריך חיבור (Supabase)</h4>
                            <div className="space-y-4">
                                <div className="border border-blue-200 bg-blue-50 rounded-xl overflow-hidden">
                                    <div className="p-4 bg-white text-sm space-y-4 border-t border-blue-100">
                                        <p className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">מדריך מלא: איך לחבר את האתר למסד נתונים</p>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                                                <div>
                                                    <strong>פתח חשבון:</strong> כנס לאתר <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">supabase.com</a> ופתח פרויקט חדש (New Project). תן לו שם וסיסמה.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                                                <div>
                                                    <strong>השג מפתחות:</strong> אחרי שהפרויקט נוצר, כנס בתפריט בצד ל-<strong>Settings</strong> (גלגל שיניים למטה) ואז ל-<strong>API</strong>.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
                                                <div>
                                                    <strong>חבר לאתר:</strong> העתק את ה-<strong>Project URL</strong> ואת ה-<strong>anon key</strong>. שים אותם בקובץ <code>.env</code> בקוד שלך או בהגדרות הסביבה.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</div>
                                                <div>
                                                    <strong>הרץ את הקוד:</strong> ב-Supabase, לחץ בתפריט על <strong>SQL Editor</strong>. העתק את הקוד מלמטה, הדבק אותו שם ולחץ על <strong>Run</strong>.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => setOpenInstruction(openInstruction === 'supabase_sql' ? null : 'supabase_sql')}
                                        className="w-full bg-gray-50 p-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 font-bold text-gray-700">
                                            <Server size={18}/> קוד SQL (הפעלה חד פעמית)
                                        </div>
                                        {openInstruction === 'supabase_sql' ? <div className="rotate-180">▲</div> : <div>▼</div>}
                                    </button>
                                    {openInstruction === 'supabase_sql' && (
                                        <div className="p-4 bg-white text-sm space-y-3">
                                            <p className="text-red-600 font-bold bg-red-50 p-2 rounded border border-red-200 flex gap-2 items-center">
                                                <AlertTriangle size={16}/> חובה להריץ כדי שהשמירה תעבוד!
                                            </p>
                                            <div className="relative bg-gray-900 rounded-lg p-3 group mt-2">
                                                <button onClick={copyToClipboard} className="absolute top-2 left-2 bg-white/20 text-white px-2 py-1 rounded text-xs hover:bg-white/40">{copied ? 'הועתק!' : 'העתק'}</button>
                                                <pre className="text-blue-300 text-xs overflow-x-auto font-mono dir-ltr text-left h-32 custom-scrollbar">
                                                    {sqlCode}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

      </main>

      {/* Image Picker Modal ... */}
      {showImagePicker && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden h-[80vh] flex flex-col">
                  {/* ... (Image Picker Content Same as before) ... */}
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg">בחר תמונה</h3>
                      <button onClick={() => setShowImagePicker(false)}><X size={20}/></button>
                  </div>
                  
                  <div className="p-4 border-b flex gap-4">
                      <button onClick={() => setImagePickerMode('search')} className={`pb-2 border-b-2 transition-colors ${imagePickerMode === 'search' ? 'border-green-600 font-bold' : 'border-transparent'}`}>חיפוש (Unsplash)</button>
                      <button onClick={() => setImagePickerMode('upload')} className={`pb-2 border-b-2 transition-colors ${imagePickerMode === 'upload' ? 'border-green-600 font-bold' : 'border-transparent'}`}>העלאה</button>
                      <button onClick={() => setImagePickerMode('url')} className={`pb-2 border-b-2 transition-colors ${imagePickerMode === 'url' ? 'border-green-600 font-bold' : 'border-transparent'}`}>כתובת URL</button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 bg-[#FAF9F6]">
                      {imagePickerMode === 'search' && (
                          <div>
                              <div className="flex gap-2 mb-4">
                                  <input 
                                    type="text" 
                                    placeholder="חפש תמונה (באנגלית, למשל: Herbs, Nature)..." 
                                    className="w-full border p-2 rounded"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleImageSearch()}
                                  />
                                  <button onClick={handleImageSearch} className="bg-blue-600 text-white px-4 rounded"><Search size={20}/></button>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                  {searchResults.map((img: any) => (
                                      <img 
                                        key={img.id} 
                                        src={img.urls.small} 
                                        className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-green-500"
                                        onClick={() => selectImage(img.urls.regular)}
                                        alt={img.alt_description}
                                      />
                                  ))}
                                  {searchResults.length === 0 && <p className="text-center col-span-3 text-gray-400 mt-4">אין תוצאות או שלא בוצע חיפוש.</p>}
                              </div>
                          </div>
                      )}

                      {imagePickerMode === 'upload' && (
                          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-xl bg-white">
                              <Upload size={48} className="text-gray-300 mb-4"/>
                              <p className="mb-4 text-gray-500">גרור תמונה או לחץ לבחירה</p>
                              <input type="file" onChange={handleFileUpload} accept="image/*" className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100
                              "/>
                          </div>
                      )}

                      {imagePickerMode === 'url' && (
                          <div>
                              <label className="block font-bold mb-2">הדבק כתובת תמונה</label>
                              <input 
                                type="text" 
                                placeholder="https://example.com/image.jpg" 
                                className="w-full border p-3 rounded text-left ltr"
                                onBlur={(e) => { if(e.target.value) selectImage(e.target.value) }}
                              />
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* NEW: Success Toast */}
      {successMessage && (
          <div className="fixed bottom-6 right-6 z-[120] bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce">
              <div className="bg-white/20 p-2 rounded-full">
                  <Check size={24} className="text-white"/>
              </div>
              <div className="font-bold text-lg">{successMessage}</div>
          </div>
      )}

      {/* NEW: Error / Copyable Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setErrorMessage(null)}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => setErrorMessage(null)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                
                <div className="flex items-center gap-3 mb-4 text-red-600">
                    <AlertTriangle size={28} />
                    <h3 className="text-xl font-bold">שגיאה / הודעת מערכת</h3>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed select-text" dir="ltr">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(errorMessage);
                            setErrorCopied(true);
                            setTimeout(() => setErrorCopied(false), 2000);
                        }} 
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${errorCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        {errorCopied ? <Check size={18} /> : <Copy size={18} />}
                        {errorCopied ? 'הועתק!' : 'העתק שגיאה'}
                    </button>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="flex-1 bg-[#1a2e1a] text-white py-3 rounded-xl font-bold hover:bg-green-900 shadow-lg flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> רענן עמוד
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;