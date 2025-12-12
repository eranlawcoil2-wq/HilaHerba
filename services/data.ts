
import { Plant, Article, Slide, Recipe } from '../types';

export const SLIDES: Slide[] = [
  {
    id: '1',
    title: "להתחבר לקצב של הטבע",
    subtitle: "נשימה עמוקה",
    text: "העולם שסביבנו מלא בשקט ובעוצמה. כשאנחנו עוצרים לרגע ומקשיבים לרחש העלים ולזרימת המים, אנחנו מוצאים את האיזון הפנימי שאבד לנו במירוץ היומיומי.",
    image: "https://picsum.photos/seed/nature_forest/1200/1000",
    active: true,
    order: 1
  },
  {
    id: '2',
    title: "חוכמת האדמה העתיקה",
    subtitle: "שורשים וצמיחה",
    text: "כל צמח נושא בתוכו ידע עתיק שעבר מדור לדור. האדמה מלמדת אותנו סבלנות מהי, ואיך מתוך גרעין קטן יכול לצמוח יער שלם של ריפוי והתחדשות.",
    image: "https://picsum.photos/seed/earth_hands/1200/1000",
    active: true,
    order: 2
  }
];

export const PLANTS: Plant[] = [
  {
    id: '1',
    hebrewName: 'אכינצאה',
    latinName: 'Echinacea purpurea',
    description: 'צמח מרפא ידוע התומך במערכת החיסון. משמש בעיקר למניעה וטיפול בשפעת והצטננות.',
    benefits: ['חיזוק מערכת החיסון', 'נוגד דלקת', 'טיפול בזיהומים בדרכי הנשימה'],
    category: 'immune',
    imageUrl: 'https://picsum.photos/seed/echinacea/600/800',
    tabs: [
      { id: 't1', title: 'שימוש', content: 'חליטה של השורש או הפרחים, או כטינקטורה (מיצוי אלכוהולי). מומלץ ליטול בתחילת החורף או עם הופעת תסמינים ראשונים.' },
      { id: 't2', title: 'בטיחות', content: 'לא מומלץ לאנשים הסובלים ממחלות אוטואימוניות.' }
    ]
  },
  {
    id: '2',
    hebrewName: 'קמומיל',
    latinName: 'Matricaria recutita',
    description: 'צמח עדין ומרגיע, מצוין לבעיות עיכול ולרגיעה כללית לפני השינה.',
    benefits: ['הרגעה והפחתת מתח', 'הסדרת עיכול והפחתת גזים', 'נוגד עוויתות בשרירים'],
    category: 'relaxing',
    imageUrl: 'https://picsum.photos/seed/chamomile/600/800',
    tabs: [
        { id: 't1', title: 'שימוש', content: 'חליטת פרחים יבשים במים רותחים למשך 10 דקות. ניתן לשתות 3-4 פעמים ביום.' },
        { id: 't2', title: 'בטיחות', content: 'בטוח לשימוש בדרך כלל, אך יש להיזהר במקרה של אלרגיה למשפחת המורכבים.' }
    ]
  }
];

export const ARTICLES: (Article | Recipe)[] = [
  {
    id: '101',
    title: 'חיזוק המערכת החיסונית בחורף',
    summary: 'כיצד צמחי מרפא יכולים לעזור לנו לעבור את החורף בשלום? סקירה של צמחים מחממים ומחזקים.',
    date: '2023-11-15',
    imageUrl: 'https://picsum.photos/seed/winter/800/600',
    type: 'article',
    tags: ['חורף', 'מערכת חיסון', 'תזונה'],
    tabs: [
        { id: 'a1', title: 'תוכן המאמר', content: 'כאן יופיע תוכן המאמר המלא...' },
        { id: 'a2', title: 'מקורות', content: 'רשימת מקורות ומחקרים...' }
    ]
  },
  {
    id: '201',
    title: 'מרק כתום מחזק ומחמם',
    summary: 'מתכון עשיר בויטמינים ומינרלים, מצוין לימים גשומים ולחיזוק הראייה והעור.',
    date: '2024-01-10',
    imageUrl: 'https://picsum.photos/seed/soup/800/600',
    type: 'recipe',
    tags: ['מתכונים', 'תזונה', 'חורף', 'טבעוני'],
    tabs: [
        { id: 'r1', title: 'מצרכים', content: '500 גרם דלעת\n2 גזרים\nבצל אחד\nשורש ג\'ינג\'ר טרי\nחלב קוקוס' },
        { id: 'r2', title: 'אופן ההכנה', content: '1. מטגנים את הבצל...\n2. מוסיפים את הירקות...\n3. מבשלים עד ריכוך וטוחנים.' }
    ]
  }
];
