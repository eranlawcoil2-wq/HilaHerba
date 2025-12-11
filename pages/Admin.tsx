import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Save, Plus, Trash2, Edit2, Settings, FileText, LayoutDashboard, Database, Copy, Check, Image as ImageIcon, Sparkles, Upload, Search, X, MonitorPlay, HelpCircle, StickyNote, Server, HardDrive, Globe, MapPin, Key, AlertTriangle, DownloadCloud } from 'lucide-react';
import { ContentItem, Slide, Plant, Article } from '../types';
import { PLANTS, ARTICLES, SLIDES as DEMO_SLIDES } from '../services/data';

type Tab = 'general' | 'content' | 'slides' | 'connections';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { 
      general, updateGeneral, 
      content, addContent, updateContent, deleteContent,
      slides, addSlide, updateSlide, deleteSlide,
      generateAIContent, searchImages, uploadImage
  } = useSite();

  // --- States ---
  const [generalForm, setGeneralForm] = useState(general);
  
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
  
  // Image Picker State
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'content' | 'slide' | null>(null);
  const [imagePickerMode, setImagePickerMode] = useState<'url' | 'upload' | 'search'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Accordion State for Instructions
  const [openInstruction, setOpenInstruction] = useState<'supabase_sql' | 'supabase_storage' | 'deploy' | null>('deploy');

  // --- Handlers ---

  const handleGeneralSave = async () => {
    try {
        await updateGeneral(generalForm);
        alert('הגדרות נשמרו בהצלחה!');
    } catch (error) {
        alert('שגיאה בשמירה. וודא שהאתר מחובר למסד הנתונים ושביצעת את שלב ה-SQL.');
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
                 await addContent(article);
                 count++;
             }
        }
        alert(`התהליך הסתיים. ${count} פריטים נוספו בהצלחה!`);
    } catch (e: any) {
        alert('שגיאה בטעינת נתונים: ' + e.message);
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
      tabs: []
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
    } catch (e) {
        alert('שגיאה בשמירה. וודא שהרשאות ה-SQL הופעלו ב-Supabase.');
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
      } catch (e) {
          alert('שגיאה בשמירה. וודא שהרשאות ה-SQL הופעלו.');
      }
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('האם אתה בטוח?')) deleteContent(id);
  };

  const handleDeleteSlide = (id: string) => {
      if (confirm('למחוק שקופית זו?')) deleteSlide(id);
  };

  // --- AI Logic ---
  const handleAI = async (targetField: string, promptBase: string) => {
      if (!general.geminiKey) return alert("שגיאה: חסר מפתח Gemini. נא להגדיר בטאב 'חיבורים' ולשמור.");
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
          alert('שגיאה ביצירת תוכן: ' + (e.message || 'נסה שוב'));
      } finally {
          setAiLoading(false);
      }
  };

  const handleAutoTabs = async () => {
      if (!editingItem || !general.geminiKey) return alert("חסר מפתח AI או פריט לעריכה");
      setAiLoading(true);
      
      let prompt = "";
      
      // --- PLANT PROMPT ---
      if (editingItem.type === 'plant') {
          const plantName = (editingItem as Plant).hebrewName || "Unnamed Plant";
          prompt = `
            You are a world-renowned expert in Clinical Herbal Medicine (Herbalist) with 30 years of experience.
            Your task is to write a comprehensive, deep, and highly professional profile for the medicinal plant: "${plantName}".
            
            You must return a JSON array of tab objects. Each object has "title" and "content".
            The content must be in Hebrew, formatted as clean text with newlines (HTML friendly, but no heavy tags).
            
            Required Tabs (Content must be very detailed, not superficial):
            1. "פעילות רפואית ומנגנון" (Clinical Actions & Mechanism): Explain exactly how it works on the body, active constituents, and pharmacology.
            2. "שימושים קליניים" (Clinical Uses): Detailed list of conditions it treats, specifying acute vs chronic.
            3. "בטיחות והתוויות נגד" (Safety & Contraindications): Pregnancy, lactation, drug interactions (CYP450), and side effects. Be very specific.
            4. "מינון ואופן שימוש" (Dosage & Preparation): Tincture ratios (1:3, 1:5), decoction vs infusion, specific dosages.
            5. "פולקלור ומסורת" (Tradition): Historical uses in TCM, Ayurveda, or Western herbalism.
            
            Output strictly valid JSON: [{"title": "...", "content": "..."}]
            Do not cut corners. Think deeply before generating. The quality should be suitable for a medical textbook.
          `;
      } 
      // --- ARTICLE / CASE STUDY PROMPT ---
      else {
          const title = (editingItem as Article).title || "Untitled Article";
          const type = editingItem.type === 'case_study' ? 'Case Study' : 'Professional Article';
          prompt = `
            You are a senior editor of a prestigious Herbal Medicine Journal.
            Write a deep, long-form, and professional ${type} titled: "${title}".
            
            You must return a JSON array of tab objects. Each object has "title" and "content".
            The content must be in Hebrew.
            
            If it is a Case Study, suggested tabs: "רקע המטופל", "אבחנה (מסורתית/מערבית)", "פרוטוקול הטיפול", "מעקב ותוצאות", "דיון קליני".
            If it is an Article, suggested tabs: "מבוא", "פיזיולוגיה/פתולוגיה", "הגישה הטיפולית", "צמחים רלוונטיים", "מחקרים ותוצאות", "סיכום".
            
            Write extensive content for each tab. Demonstrate deep understanding of pathology and herbal actions.
            Output strictly valid JSON: [{"title": "...", "content": "..."}]
          `;
      }
      
      try {
          const res = await generateAIContent(prompt, 'json');
          
          // Clean the response if it contains markdown code blocks
          const jsonString = res.replace(/```json/g, '').replace(/```/g, '').trim();
          
          const tabs = JSON.parse(jsonString);
          const mappedTabs = tabs.map((t: any, i: number) => ({
              id: Date.now().toString() + i,
              title: t.title,
              content: t.content
          }));
          setEditingItem(prev => ({ ...prev, tabs: mappedTabs }));
      } catch (e) {
          console.error(e);
          alert('שגיאה ביצירת טאבים אוטומטית. וודא שהמפתח תקין ונסה שוב.');
      } finally {
          setAiLoading(false);
      }
  };

  // --- Image Picker Logic ---
  const handleImageSearch = async () => {
      if (!general.unsplashKey) return alert("חסר מפתח Unsplash בהגדרות");
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

  const sqlCode = `-- 1. יצירת טבלאות
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
  admin_notes text
);

-- 2. הפעלת Realtime
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

-- 3. הרשאות גישה (Row Level Security)
alter table content enable row level security;
alter table hero_slides enable row level security;
alter table general_settings enable row level security;

-- מחיקת הרשאות ישנות
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

-- יצירת הרשאות חדשות
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

-- 4. הרשאות לתמונות (Storage Policies) - קריטי להעלאת תמונות!
-- הערה: יצירת ה-Bucket עצמו חייבת להיעשות דרך הממשק אם היא נכשלת כאן, אך הפקודות הבאות יאפשרו העלאה.
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
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                { id: 'connections', label: 'חיבורים ותזכורות', icon: Database },
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
                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">אימייל</label>
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
                    <button onClick={handleGeneralSave} className="bg-[#1a2e1a] text-white px-8 py-3 rounded-lg font-bold flex gap-2"><Save size={18}/> שמור</button>
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
                        <h4 className="font-bold mb-4 text-xl">עריכת שקופית</h4>
                        <div className="space-y-4">
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block font-bold text-sm mb-1">כותרת ראשית</label>
                                    <input type="text" value={editingSlide?.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full border p-2 rounded" />
                                </div>
                                <button 
                                    onClick={() => handleAI('title', 'Suggest a generic, inspiring short title for a herbalist website hero slide (Hebrew)')}
                                    className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                                    title="Generate with AI"
                                ><Sparkles size={20} /></button>
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
                                <button 
                                     onClick={() => handleAI('text', `Write a short inspiring paragraph (Hebrew) about nature connection for a slide titled "${editingSlide?.title}"`)}
                                     className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                                ><Sparkles size={20} /></button>
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

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
             <div className="max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                     <h3 className="text-3xl font-bold text-gray-800">ניהול תכנים</h3>
                     <button onClick={handleCreateNewContent} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20} /> הוסף תוכן</button>
                </div>

                {!isEditingContent ? (
                    <>
                        {content.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                <div className="bg-green-100 p-4 rounded-full mb-4">
                                    <Database size={48} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">לא נמצא תוכן באתר</h3>
                                <p className="text-gray-500 max-w-md text-center mb-8">
                                    האתר מחובר למסד הנתונים אך הטבלה ריקה. ניתן לטעון נתוני הדגמה (צמחים ומאמרים) כדי להתחיל לעבוד.
                                </p>
                                <button 
                                    onClick={handleLoadDemoData} 
                                    disabled={isLoadingDemo}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                                >
                                    {isLoadingDemo ? (
                                        <>טוען נתונים...</>
                                    ) : (
                                        <><DownloadCloud size={20}/> טען נתוני הדגמה</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                                <table className="w-full text-right">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4">תמונה</th>
                                            <th className="px-6 py-4">כותרת</th>
                                            <th className="px-6 py-4">סוג</th>
                                            <th className="px-6 py-4">פעולות</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {content.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4"><img src={item.imageUrl} className="w-10 h-10 rounded object-cover" alt=""/></td>
                                                <td className="px-6 py-4 font-bold">{item.type === 'plant' ? item.hebrewName : item.title}</td>
                                                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.type}</span></td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button onClick={() => {setEditingItem(JSON.parse(JSON.stringify(item))); setIsEditingContent(true);}} className="text-blue-600"><Edit2 size={18}/></button>
                                                    <button onClick={() => handleDeleteContent(item.id)} className="text-red-600"><Trash2 size={18}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
                         <div className="flex justify-between">
                            <h4 className="font-bold text-xl">עריכת תוכן</h4>
                            <button onClick={() => setIsEditingContent(false)}>ביטול</button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-bold text-sm mb-1">סוג</label>
                                <select 
                                    value={editingItem?.type} 
                                    onChange={e => setEditingItem({...editingItem, type: e.target.value as any})}
                                    className="w-full border p-2 rounded"
                                >
                                    <option value="plant">צמח מרפא</option>
                                    <option value="article">מאמר</option>
                                    <option value="case_study">מקרה אירוע</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-sm mb-1">תמונה ראשית</label>
                                <div className="flex gap-2">
                                    <input type="text" value={editingItem?.imageUrl} onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})} className="w-full border p-2 rounded ltr" />
                                     <button 
                                        onClick={() => { setImagePickerTarget('content'); setShowImagePicker(true); }}
                                        className="bg-gray-100 px-3 rounded hover:bg-gray-200"
                                    >
                                        <ImageIcon size={18}/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {editingItem?.type === 'plant' ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div><label className="block font-bold text-sm">שם עברי</label><input type="text" className="w-full border p-2 rounded" value={(editingItem as Plant).hebrewName} onChange={e => setEditingItem({...editingItem, hebrewName: e.target.value} as ContentItem)} /></div>
                                <div><label className="block font-bold text-sm">שם לטיני</label><input type="text" className="w-full border p-2 rounded" value={(editingItem as Plant).latinName} onChange={e => setEditingItem({...editingItem, latinName: e.target.value} as ContentItem)} /></div>
                                <div className="md:col-span-2">
                                     <div className="flex justify-between"><label className="block font-bold text-sm">תיאור קצר</label> <button onClick={() => handleAI('description', `Write a short description (Hebrew) for medicinal plant: ${(editingItem as Plant).hebrewName}`)}><Sparkles size={16} className="text-purple-500"/></button></div>
                                     <textarea className="w-full border p-2 rounded" rows={3} value={(editingItem as Plant).description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                                </div>
                                <div><label className="block font-bold text-sm">קטגוריה</label>
                                    <select className="w-full border p-2 rounded" value={(editingItem as Plant).category} onChange={e => setEditingItem({...editingItem, category: e.target.value as any} as ContentItem)}>
                                        <option value="general">כללי</option>
                                        <option value="relaxing">הרגעה</option>
                                        <option value="immune">חיסון</option>
                                        <option value="digestive">עיכול</option>
                                        <option value="skin">עור</option>
                                    </select>
                                </div>
                                <div><label className="block font-bold text-sm">תגיות/יתרונות (פסיקים)</label><input type="text" className="w-full border p-2 rounded" value={(editingItem as Plant).benefits?.join(', ')} onChange={e => setEditingItem({...editingItem, benefits: e.target.value.split(',').map(s => s.trim())} as ContentItem)} /></div>
                            </div>
                        ) : (
                             <div className="grid gap-6">
                                <div><label className="block font-bold text-sm">כותרת</label><input type="text" className="w-full border p-2 rounded" value={(editingItem as Article).title} onChange={e => setEditingItem({...editingItem, title: e.target.value} as ContentItem)} /></div>
                                <div>
                                     <div className="flex justify-between"><label className="block font-bold text-sm">תקציר</label> <button onClick={() => handleAI('summary', `Write a summary (Hebrew) for article: ${(editingItem as Article).title}`)}><Sparkles size={16} className="text-purple-500"/></button></div>
                                     <textarea className="w-full border p-2 rounded" rows={3} value={(editingItem as Article).summary} onChange={e => setEditingItem({...editingItem, summary: e.target.value})} />
                                </div>
                                <div><label className="block font-bold text-sm">תגיות (פסיקים)</label><input type="text" className="w-full border p-2 rounded" value={(editingItem as Article).tags?.join(', ')} onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s => s.trim())} as ContentItem)} /></div>
                                <div><label className="block font-bold text-sm">תאריך</label><input type="date" className="w-full border p-2 rounded" value={(editingItem as Article).date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
                            </div>
                        )}

                        {/* Dynamic Tabs Section */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg">תוכן נוסף (טאבים)</h4>
                                <div className="flex gap-2">
                                     <button onClick={handleAutoTabs} className="bg-purple-600 text-white shadow-lg px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-purple-700 transition-colors" disabled={aiLoading}>
                                        {aiLoading ? 'חושב וכותב (זה יכול לקחת רגע)...' : <><Sparkles size={16}/> צור תוכן מקצועי מלא (AI)</>}
                                     </button>
                                     <button 
                                        onClick={() => setEditingItem(prev => ({...prev, tabs: [...(prev?.tabs || []), { id: Date.now().toString(), title: 'טאב חדש', content: '' }] }))}
                                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                                     >
                                        <Plus size={14}/> הוסף טאב
                                     </button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {editingItem?.tabs?.map((tab, idx) => (
                                    <div key={tab.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                        <button 
                                            onClick={() => setEditingItem(prev => ({...prev, tabs: prev?.tabs?.filter(t => t.id !== tab.id)}))}
                                            className="absolute top-2 left-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="mb-2">
                                            <label className="text-xs font-bold text-gray-500">כותרת הטאב</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-white border p-2 rounded text-sm font-bold"
                                                value={tab.title}
                                                onChange={e => {
                                                    const newTabs = [...(editingItem.tabs || [])];
                                                    newTabs[idx].title = e.target.value;
                                                    setEditingItem({...editingItem, tabs: newTabs});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between">
                                                <label className="text-xs font-bold text-gray-500">תוכן</label>
                                                <button onClick={() => handleAI('tab_content', `Write extensive professional content for tab "${tab.title}" for subject: ${editingItem.type === 'plant' ? (editingItem as any).hebrewName : (editingItem as any).title}`)}><Sparkles size={14} className="text-purple-400 hover:text-purple-600"/></button>
                                            </div>
                                            <textarea 
                                                rows={5}
                                                className="w-full bg-white border p-2 rounded text-sm"
                                                value={tab.content}
                                                 onChange={e => {
                                                    const newTabs = [...(editingItem.tabs || [])];
                                                    newTabs[idx].content = e.target.value;
                                                    setEditingItem({...editingItem, tabs: newTabs});
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!editingItem?.tabs || editingItem.tabs.length === 0) && <p className="text-gray-400 text-sm text-center">אין טאבים. לחץ על כפתור ה-AI הסגול ליצירת מאמר שלם.</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t flex gap-4">
                             <button onClick={handleSaveContent} className="bg-green-600 text-white px-8 py-2 rounded font-bold">שמור פריט</button>
                             <button onClick={() => setIsEditingContent(false)} className="bg-gray-200 text-gray-800 px-8 py-2 rounded font-bold">ביטול</button>
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === 'connections' && (
            <div className="max-w-4xl">
                <h3 className="text-3xl font-bold mb-6">חיבורים והגדרות טכניות</h3>
                
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    
                    {/* LEFT COLUMN: API & Notes */}
                    <div className="space-y-6">
                         
                         {/* CRITICAL: API KEYS */}
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

                         {/* Admin Notes - PRESERVED & SECURED */}
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

                    {/* RIGHT COLUMN: Database & Instructions */}
                    <div className="space-y-6">
                         
                         {/* Supabase Guide - SIMPLIFIED UI */}
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-800"><Database size={20}/> מדריך חיבור (Supabase)</h4>
                            
                            <div className="space-y-4">

                                {/* Step-by-Step Connection Guide */}
                                <div className="border border-blue-200 bg-blue-50 rounded-xl overflow-hidden">
                                    <div className="p-4 bg-white text-sm space-y-4 border-t border-blue-100">
                                        <p className="font-bold text-lg text-gray-800 mb-4">איך לחבר את האתר? (מדריך מקוצר)</p>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                            <div>
                                                <strong>באתר Supabase:</strong> כנס ל-Settings &rarr; API.
                                                <br/><span className="text-gray-500">העתק את כתובת ה-URL ואת מפתח ה-anon public.</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                            <div>
                                                <strong>באתר Vercel:</strong> כנס ל-Settings &rarr; Environment Variables.
                                                <br/><span className="text-gray-500">הוסף שני משתנים:</span>
                                                <ul className="list-disc list-inside mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                                                    <li>VITE_SUPABASE_URL</li>
                                                    <li>VITE_SUPABASE_ANON_KEY</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                                            <div>
                                                <strong>סיום:</strong> ב-Vercel, לך ל-Deployments, לחץ על 3 הנקודות ועשה Redeploy.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 1. SQL Instructions */}
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

      {/* Image Picker Modal */}
      {showImagePicker && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden h-[80vh] flex flex-col">
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
    </div>
  );
};

export default Admin;