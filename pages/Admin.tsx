import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Save, Plus, Trash2, Edit2, Settings, FileText, LayoutDashboard, Database, Copy, Check, Image as ImageIcon, Sparkles, Upload, Search, X, MonitorPlay, HelpCircle, StickyNote } from 'lucide-react';
import { ContentItem, Slide } from '../types';

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
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);
  
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);

  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Image Picker State
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'content' | 'slide' | null>(null);
  const [imagePickerMode, setImagePickerMode] = useState<'url' | 'upload' | 'search'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Accordion State for Instructions
  const [openInstruction, setOpenInstruction] = useState<'gemini' | 'unsplash' | null>(null);

  // --- Handlers ---

  const handleGeneralSave = () => {
    updateGeneral(generalForm);
    alert('הגדרות נשמרו בהצלחה!');
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

  const handleSaveContent = () => {
    if (!editingItem) return;
    if (editingItem.type === 'plant' && !editingItem.hebrewName) return alert('נא למלא שם צמח');
    if (editingItem.type !== 'plant' && !editingItem.title) return alert('נא למלא כותרת');

    // Ensure tabs array exists
    const finalItem = { ...editingItem, tabs: editingItem.tabs || [] } as ContentItem;

    if (content.some(c => c.id === finalItem.id)) {
        updateContent(finalItem);
    } else {
        addContent(finalItem);
    }
    setIsEditingContent(false);
    setEditingItem(null);
  };

  const handleSaveSlide = () => {
      if (!editingSlide) return;
      if (!editingSlide.title) return alert('חובה להזין כותרת');
      
      const finalSlide = editingSlide as Slide;
      if (slides.some(s => s.id === finalSlide.id)) {
          updateSlide(finalSlide);
      } else {
          addSlide(finalSlide);
      }
      setIsEditingSlide(false);
      setEditingSlide(null);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('האם אתה בטוח?')) deleteContent(id);
  };

  const handleDeleteSlide = (id: string) => {
      if (confirm('למחוק שקופית זו?')) deleteSlide(id);
  };

  // --- AI Logic ---
  const handleAI = async (targetField: string, promptBase: string) => {
      if (!general.geminiKey) return alert("נא להגדיר מפתח Gemini בטאב חיבורים");
      setAiLoading(true);
      try {
          const res = await generateAIContent(promptBase, 'text');
          if (isEditingContent && editingItem) {
             setEditingItem(prev => ({ ...prev, [targetField]: res }));
          } else if (isEditingSlide && editingSlide) {
             setEditingSlide(prev => ({ ...prev, [targetField]: res }));
          }
      } catch (e) {
          alert('שגיאה ב-AI');
      } finally {
          setAiLoading(false);
      }
  };

  const handleAutoTabs = async () => {
      if (!editingItem || !general.geminiKey) return alert("חסר מפתח AI או פריט לעריכה");
      setAiLoading(true);
      const name = editingItem.type === 'plant' ? editingItem.hebrewName : editingItem.title;
      const type = editingItem.type === 'plant' ? 'Medicinal Plant' : 'Article';
      const prompt = `Create a JSON array of objects for a ${type} named "${name}". 
      Each object must have "title" (Hebrew) and "content" (Hebrew, HTML friendly but no tags, plain text with newlines).
      For a plant, suggesting tabs: "שימוש", "בטיחות", "מחקרים", "פולקלור".
      For article, suggest "מבוא", "גוף המאמר", "סיכום".
      Format: [{"title": "...", "content": "..."}]`;
      
      try {
          const res = await generateAIContent(prompt, 'json');
          const tabs = JSON.parse(res);
          const mappedTabs = tabs.map((t: any, i: number) => ({
              id: Date.now().toString() + i,
              title: t.title,
              content: t.content
          }));
          setEditingItem(prev => ({ ...prev, tabs: mappedTabs }));
      } catch (e) {
          console.error(e);
          alert('שגיאה ביצירת טאבים אוטומטית');
      } finally {
          setAiLoading(false);
      }
  };

  // --- Image Picker Logic ---
  const handleImageSearch = async () => {
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
          if (url) selectImage(url);
      }
  };

  const copyToClipboard = () => {
    const sql = `-- טבלת תכנים (צמחים ומאמרים)
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

-- טבלת סליידר (Hero)
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

-- טבלת הגדרות כלליות
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

-- הפעלת Realtime
alter publication supabase_realtime add table content;
alter publication supabase_realtime add table general_settings;
alter publication supabase_realtime add table hero_slides;`;
    navigator.clipboard.writeText(sql);
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
                { id: 'connections', label: 'חיבורים (API)', icon: Database },
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
                                <div><label className="block font-bold text-sm">שם עברי</label><input type="text" className="w-full border p-2 rounded" value={editingItem.hebrewName} onChange={e => setEditingItem({...editingItem, hebrewName: e.target.value})} /></div>
                                <div><label className="block font-bold text-sm">שם לטיני</label><input type="text" className="w-full border p-2 rounded" value={editingItem.latinName} onChange={e => setEditingItem({...editingItem, latinName: e.target.value})} /></div>
                                <div className="md:col-span-2">
                                     <div className="flex justify-between"><label className="block font-bold text-sm">תיאור קצר</label> <button onClick={() => handleAI('description', `Write a short description (Hebrew) for medicinal plant: ${editingItem.hebrewName}`)}><Sparkles size={16} className="text-purple-500"/></button></div>
                                     <textarea className="w-full border p-2 rounded" rows={3} value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                                </div>
                                <div><label className="block font-bold text-sm">קטגוריה</label>
                                    <select className="w-full border p-2 rounded" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as any})}>
                                        <option value="general">כללי</option>
                                        <option value="relaxing">הרגעה</option>
                                        <option value="immune">חיסון</option>
                                        <option value="digestive">עיכול</option>
                                        <option value="skin">עור</option>
                                    </select>
                                </div>
                                <div><label className="block font-bold text-sm">תגיות/יתרונות (פסיקים)</label><input type="text" className="w-full border p-2 rounded" value={editingItem.benefits?.join(', ')} onChange={e => setEditingItem({...editingItem, benefits: e.target.value.split(',').map(s => s.trim())})} /></div>
                            </div>
                        ) : (
                             <div className="grid gap-6">
                                <div><label className="block font-bold text-sm">כותרת</label><input type="text" className="w-full border p-2 rounded" value={editingItem?.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /></div>
                                <div>
                                     <div className="flex justify-between"><label className="block font-bold text-sm">תקציר</label> <button onClick={() => handleAI('summary', `Write a summary (Hebrew) for article: ${editingItem?.title}`)}><Sparkles size={16} className="text-purple-500"/></button></div>
                                     <textarea className="w-full border p-2 rounded" rows={3} value={editingItem?.summary} onChange={e => setEditingItem({...editingItem, summary: e.target.value})} />
                                </div>
                                <div><label className="block font-bold text-sm">תגיות (פסיקים)</label><input type="text" className="w-full border p-2 rounded" value={editingItem?.tags?.join(', ')} onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s => s.trim())})} /></div>
                                <div><label className="block font-bold text-sm">תאריך</label><input type="date" className="w-full border p-2 rounded" value={editingItem?.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
                            </div>
                        )}

                        {/* Dynamic Tabs Section */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg">תוכן נוסף (טאבים)</h4>
                                <div className="flex gap-2">
                                     <button onClick={handleAutoTabs} className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-purple-200" disabled={aiLoading}>
                                        {aiLoading ? 'חושב...' : <><Sparkles size={14}/> טאבים אוטומטיים</>}
                                     </button>
                                     <button 
                                        onClick={() => setEditingItem(prev => ({...prev, tabs: [...(prev?.tabs || []), { id: Date.now().toString(), title: 'טאב חדש', content: '' }] }))}
                                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm flex items-center gap-1"
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
                                                <button onClick={() => handleAI('tab_content', `Write content for tab "${tab.title}" for ${editingItem.hebrewName || editingItem.title}`)}><Sparkles size={14} className="text-purple-400 hover:text-purple-600"/></button>
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
                                {(!editingItem?.tabs || editingItem.tabs.length === 0) && <p className="text-gray-400 text-sm text-center">אין טאבים. הוסף ידנית או השתמש ב-AI.</p>}
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
                
                <div className="space-y-8">
                    {/* API KEYS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-xl mb-4 text-purple-700 flex items-center gap-2"><Sparkles size={20}/> הגדרות AI ותמונות</h4>
                        <div className="space-y-6">
                            
                            {/* Gemini Key */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <label className="block text-sm font-bold text-gray-800">Google Gemini API Key (עבור טקסט אוטומטי)</label>
                                    <button 
                                        onClick={() => setOpenInstruction(openInstruction === 'gemini' ? null : 'gemini')}
                                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                        <HelpCircle size={14} /> איך משיגים?
                                    </button>
                                </div>
                                {openInstruction === 'gemini' && (
                                    <div className="text-sm text-gray-600 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>כנס ל- <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 underline">Google AI Studio</a>.</li>
                                            <li>התחבר עם חשבון Google שלך.</li>
                                            <li>לחץ על <strong>Create API Key</strong>.</li>
                                            <li>בחר בפרויקט קיים או צור חדש.</li>
                                            <li>העתק את המפתח שנוצר (מתחיל ב-AIza) והדבק אותו כאן למטה.</li>
                                        </ol>
                                    </div>
                                )}
                                <input 
                                    type="password" 
                                    className="w-full border p-2 rounded bg-white"
                                    placeholder="AIzaSy..."
                                    value={generalForm.geminiKey}
                                    onChange={e => setGeneralForm({...generalForm, geminiKey: e.target.value})}
                                />
                            </div>

                            {/* Unsplash Key */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <label className="block text-sm font-bold text-gray-800">Unsplash Access Key (עבור חיפוש תמונות)</label>
                                    <button 
                                        onClick={() => setOpenInstruction(openInstruction === 'unsplash' ? null : 'unsplash')}
                                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                        <HelpCircle size={14} /> איך משיגים?
                                    </button>
                                </div>
                                {openInstruction === 'unsplash' && (
                                    <div className="text-sm text-gray-600 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>הרשם כמפתח ב- <a href="https://unsplash.com/developers" target="_blank" className="text-blue-600 underline">Unsplash Developers</a>.</li>
                                            <li>לחץ על <strong>Your Apps</strong> ואז <strong>New Application</strong>.</li>
                                            <li>אשר את התנאים ולחץ Accept.</li>
                                            <li>תן שם לאפליקציה (למשל "My Herbal Site") ולחץ Create.</li>
                                            <li>גלול למטה לחלק של <strong>Keys</strong> והעתק את ה-<strong>Access Key</strong>.</li>
                                        </ol>
                                    </div>
                                )}
                                <input 
                                    type="password" 
                                    className="w-full border p-2 rounded bg-white"
                                    value={generalForm.unsplashKey}
                                    onChange={e => setGeneralForm({...generalForm, unsplashKey: e.target.value})}
                                />
                            </div>

                            <button onClick={handleGeneralSave} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-purple-700 transition-colors">שמור מפתחות</button>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-yellow-600"><StickyNote size={20}/> תזכורות והערות אישיות</h4>
                         <p className="text-sm text-gray-500 mb-2">מקום לכתוב לעצמך דברים שצריך לעשות, רעיונות למאמרים או כל דבר אחר.</p>
                         <textarea 
                            className="w-full border p-4 rounded-xl bg-yellow-50 text-gray-800 min-h-[150px] shadow-inner focus:bg-white transition-colors"
                            placeholder="כתוב כאן..."
                            value={generalForm.adminNotes}
                            onChange={e => setGeneralForm({...generalForm, adminNotes: e.target.value})}
                         />
                         <div className="mt-4 flex justify-end">
                            <button onClick={handleGeneralSave} className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-yellow-700 transition-colors">שמור הערות</button>
                         </div>
                    </div>

                    {/* DB INSTRUCTIONS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-xl mb-4 flex items-center gap-2"><Database size={20}/> עדכון מסד נתונים</h4>
                        <p className="text-gray-600 mb-4 text-sm">
                            עקב השינויים במבנה (טאבים דינמיים, סליידר, הערות מנהל), יש להריץ את ה-SQL הבא ב-Supabase:
                        </p>
                        <div className="relative bg-gray-900 rounded-lg p-4 group">
                             <button onClick={copyToClipboard} className="absolute top-2 left-2 bg-white/20 text-white px-2 py-1 rounded text-xs hover:bg-white/40">{copied ? 'הועתק!' : 'העתק'}</button>
                             <pre className="text-blue-300 text-xs overflow-x-auto font-mono dir-ltr text-left">
                                {`-- טבלת סליידר (Hero)
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

-- עדכון טבלת תוכן (הוספת עמודת טאבים)
alter table content add column if not exists tabs jsonb default '[]'::jsonb;

-- הוספת מפתחות לטבלת הגדרות
alter table general_settings add column if not exists gemini_key text;
alter table general_settings add column if not exists unsplash_key text;
alter table general_settings add column if not exists admin_notes text;

-- הפעלת Realtime
alter publication supabase_realtime add table hero_slides;`}
                             </pre>
                        </div>
                         <p className="mt-4 text-sm text-gray-500 bg-yellow-50 p-2 rounded">
                            <strong>שים לב:</strong> כדי לאפשר העלאת תמונות, עליך ליצור Bucket ב-Storage של Supabase בשם <code>public-images</code> ולהגדיר אותו כ-Public.
                        </p>
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