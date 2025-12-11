import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Save, Plus, Trash2, Edit2, Settings, FileText, LayoutDashboard } from 'lucide-react';
import { ContentItem, Plant, Article } from '../types';

type Tab = 'general' | 'content';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { general, updateGeneral, content, addContent, updateContent, deleteContent } = useSite();

  // General Settings State
  const [generalForm, setGeneralForm] = useState(general);

  // Content Management State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);

  const handleGeneralSave = () => {
    updateGeneral(generalForm);
    alert('הגדרות נשמרו בהצלחה!');
  };

  const handleCreateNew = () => {
    setEditingItem({
      id: Date.now().toString(),
      type: 'plant',
      imageUrl: 'https://picsum.photos/seed/new/600/800',
      // Default Plant Fields
      hebrewName: '',
      latinName: '',
      description: '',
      benefits: [],
      usage: '',
      precautions: '',
      category: 'general',
      // Default Article Fields
      title: '',
      summary: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setIsEditing(true);
  };

  const handleSaveContent = () => {
    if (!editingItem) return;
    
    // Validate basics
    if (editingItem.type === 'plant') {
       if (!editingItem.hebrewName) return alert('נא למלא שם צמח');
    } else {
       if (!editingItem.title) return alert('נא למלא כותרת');
    }

    if (content.some(c => c.id === editingItem.id)) {
        updateContent(editingItem as ContentItem);
    } else {
        addContent(editingItem as ContentItem);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
        deleteContent(id);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-l border-gray-200 p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-8 text-[#1a2e1a] flex items-center gap-2">
            <LayoutDashboard size={24} />
            ניהול אתר
        </h2>
        <nav className="flex flex-col gap-2">
            <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'general' ? 'bg-[#1a2e1a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <Settings size={20} />
                הגדרות כלליות
            </button>
            <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'content' ? 'bg-[#1a2e1a] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <FileText size={20} />
                ניהול תכנים
            </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12">
        
        {/* GENERAL SETTINGS TAB */}
        {activeTab === 'general' && (
            <div className="max-w-3xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">הגדרות כלליות</h3>
                
                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">שם האתר</label>
                            <input 
                                type="text" 
                                value={generalForm.siteName}
                                onChange={e => setGeneralForm({...generalForm, siteName: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">שם המטפלת</label>
                            <input 
                                type="text" 
                                value={generalForm.therapistName}
                                onChange={e => setGeneralForm({...generalForm, therapistName: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">טלפון</label>
                            <input 
                                type="text" 
                                value={generalForm.phone}
                                onChange={e => setGeneralForm({...generalForm, phone: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">אימייל</label>
                            <input 
                                type="text" 
                                value={generalForm.email}
                                onChange={e => setGeneralForm({...generalForm, email: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">כתובת</label>
                            <input 
                                type="text" 
                                value={generalForm.address}
                                onChange={e => setGeneralForm({...generalForm, address: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">תיאור קצר (מופיע בפוטר)</label>
                        <textarea 
                            rows={2}
                            value={generalForm.aboutShort}
                            onChange={e => setGeneralForm({...generalForm, aboutShort: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">טקסט "נעים להכיר" (דף הבית / אודות)</label>
                        <textarea 
                            rows={6}
                            value={generalForm.aboutLong}
                            onChange={e => setGeneralForm({...generalForm, aboutLong: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={handleGeneralSave}
                            className="bg-[#1a2e1a] text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors flex items-center gap-2"
                        >
                            <Save size={18} /> שמור שינויים
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* CONTENT MANAGEMENT TAB */}
        {activeTab === 'content' && (
            <div className="max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                     <h3 className="text-3xl font-bold text-gray-800">ניהול תכנים</h3>
                     <button 
                        onClick={handleCreateNew}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                     >
                        <Plus size={20} /> הוסף חדש
                     </button>
                </div>

                {!isEditing ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700">תמונה</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">כותרת / שם</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">סוג</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">פעולות</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {content.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {item.type === 'plant' ? item.hebrewName : item.title}
                                            <div className="text-xs text-gray-400">
                                                {item.type === 'plant' ? item.latinName : item.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                item.type === 'plant' ? 'bg-green-100 text-green-800' :
                                                item.type === 'article' ? 'bg-blue-100 text-blue-800' :
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {item.type === 'plant' ? 'צמח מרפא' : item.type === 'article' ? 'מאמר' : 'מקרה אירוע'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-3">
                                            <button 
                                                onClick={() => { setEditingItem(item); setIsEditing(true); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold">
                                {editingItem?.id && content.some(c => c.id === editingItem?.id) ? 'עריכת פריט' : 'יצירת פריט חדש'}
                            </h4>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">ביטול</button>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">סוג תוכן</label>
                                <select 
                                    value={editingItem?.type}
                                    onChange={e => setEditingItem({...editingItem, type: e.target.value as any})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                >
                                    <option value="plant">צמח מרפא</option>
                                    <option value="article">מאמר</option>
                                    <option value="case_study">מקרה אירוע</option>
                                </select>
                            </div>
                            
                            {/* Plant Fields */}
                            {editingItem?.type === 'plant' && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">שם הצמח (עברית)</label>
                                            <input 
                                                type="text"
                                                value={editingItem.hebrewName || ''}
                                                onChange={e => setEditingItem({...editingItem, hebrewName: e.target.value})}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">שם לטיני</label>
                                            <input 
                                                type="text"
                                                value={editingItem.latinName || ''}
                                                onChange={e => setEditingItem({...editingItem, latinName: e.target.value})}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">קטגוריה</label>
                                        <select 
                                            value={editingItem.category}
                                            onChange={e => setEditingItem({...editingItem, category: e.target.value as any})}
                                            className="w-full px-4 py-2 border rounded-lg bg-white"
                                        >
                                            <option value="general">כללי</option>
                                            <option value="relaxing">הרגעה</option>
                                            <option value="digestive">עיכול</option>
                                            <option value="immune">חיסון</option>
                                            <option value="skin">עור</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">תיאור קצר</label>
                                        <textarea
                                            value={editingItem.description || ''}
                                            onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg h-24"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">יתרונות (מופרדים בפסיק)</label>
                                        <input 
                                            type="text"
                                            value={editingItem.benefits?.join(', ') || ''}
                                            onChange={e => setEditingItem({...editingItem, benefits: e.target.value.split(',').map(s => s.trim())})}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="לדוגמה: הרגעה, שינה, כאבי בטן"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">אופן השימוש</label>
                                        <textarea
                                            value={editingItem.usage || ''}
                                            onChange={e => setEditingItem({...editingItem, usage: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg h-24"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">בטיחות והתוויות נגד</label>
                                        <textarea
                                            value={editingItem.precautions || ''}
                                            onChange={e => setEditingItem({...editingItem, precautions: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg h-24"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Article/Case Study Fields */}
                            {(editingItem?.type === 'article' || editingItem?.type === 'case_study') && (
                                <>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">כותרת</label>
                                        <input 
                                            type="text"
                                            value={editingItem.title || ''}
                                            onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">תקציר</label>
                                        <textarea
                                            value={editingItem.summary || ''}
                                            onChange={e => setEditingItem({...editingItem, summary: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg h-24"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">תוכן מלא</label>
                                        <textarea
                                            value={editingItem.content || ''}
                                            onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg h-48"
                                        />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">תגיות (מופרדות בפסיק)</label>
                                        <input 
                                            type="text"
                                            value={editingItem.tags?.join(', ') || ''}
                                            onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s => s.trim())})}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">תאריך</label>
                                        <input 
                                            type="date"
                                            value={editingItem.date || ''}
                                            onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">קישור לתמונה (URL)</label>
                                <input 
                                    type="text"
                                    value={editingItem?.imageUrl || ''}
                                    onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg text-left"
                                    dir="ltr"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleSaveContent}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                                >
                                    שמור
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                >
                                    ביטול
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default Admin;