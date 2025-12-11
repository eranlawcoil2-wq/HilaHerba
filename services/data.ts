import { Plant, Article } from '../types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    hebrewName: 'אכינצאה',
    latinName: 'Echinacea purpurea',
    description: 'צמח מרפא ידוע התומך במערכת החיסון. משמש בעיקר למניעה וטיפול בשפעת והצטננות.',
    benefits: ['חיזוק מערכת החיסון', 'נוגד דלקת', 'טיפול בזיהומים בדרכי הנשימה'],
    usage: 'חליטה של השורש או הפרחים, או כטינקטורה (מיצוי אלכוהולי). מומלץ ליטול בתחילת החורף או עם הופעת תסמינים ראשונים.',
    precautions: 'לא מומלץ לאנשים הסובלים ממחלות אוטואימוניות.',
    category: 'immune',
    imageUrl: 'https://picsum.photos/seed/echinacea/600/800'
  },
  {
    id: '2',
    hebrewName: 'קמומיל',
    latinName: 'Matricaria recutita',
    description: 'צמח עדין ומרגיע, מצוין לבעיות עיכול ולרגיעה כללית לפני השינה.',
    benefits: ['הרגעה והפחתת מתח', 'הסדרת עיכול והפחתת גזים', 'נוגד עוויתות בשרירים'],
    usage: 'חליטת פרחים יבשים במים רותחים למשך 10 דקות. ניתן לשתות 3-4 פעמים ביום.',
    precautions: 'בטוח לשימוש בדרך כלל, אך יש להיזהר במקרה של אלרגיה למשפחת המורכבים.',
    category: 'relaxing',
    imageUrl: 'https://picsum.photos/seed/chamomile/600/800'
  },
  {
    id: '3',
    hebrewName: 'סמבוק שחור',
    latinName: 'Sambucus nigra',
    description: 'פירות הסמבוק עשירים בנוגדי חמצון ומסייעים בהתמודדות עם וירוסים.',
    benefits: ['פעילות אנטי-ויראלית חזקה', 'מייזע ומוריד חום', 'חיזוק חיסוני עמוק'],
    usage: 'סירופ המופק מהפירות, או חליטה של הפרחים. מצוין לילדים בשל הטעם המתוק.',
    precautions: 'אין לאכול את הפירות הטריים ללא בישול (עלולים לגרום לכאבי בטן).',
    category: 'immune',
    imageUrl: 'https://picsum.photos/seed/elderberry/600/800'
  },
  {
    id: '4',
    hebrewName: 'לבנדר',
    latinName: 'Lavandula angustifolia',
    description: 'השמן האתרי והפרחים משמשים להרגעה, חיטוי וטיפול בבעיות עור.',
    benefits: ['הרגעה ושיפור שינה', 'חיטוי פצעים וחתכים', 'טיפול בכוויות ועקיצות'],
    usage: 'שמן אתרי בהרחה או במבער, חליטה של הפרחים, או מריחה חיצונית על העור (מהול).',
    precautions: 'שימוש פנימי בשמן אתרי דורש ייעוץ מקצועי.',
    category: 'skin',
    imageUrl: 'https://picsum.photos/seed/lavender/600/800'
  },
  {
    id: '5',
    hebrewName: 'שומר',
    latinName: 'Foeniculum vulgare',
    description: 'זרעי השומר מצוינים להקלה על גזים ונפיחות בבטן.',
    benefits: ['שיפור תהליכי עיכול', 'סילוק גזים ונפיחות', 'הגברת חלב אם למניקות'],
    usage: 'לעיסת הזרעים לאחר הארוחה, או חליטה של הזרעים הכתושים.',
    precautions: 'לא מומלץ בהריון במינונים גבוהים.',
    category: 'digestive',
    imageUrl: 'https://picsum.photos/seed/fennel/600/800'
  },
  {
    id: '6',
    hebrewName: 'מליסה',
    latinName: 'Melissa officinalis',
    description: 'צמח מרגיע המרומם את מצב הרוח ומסייע בשינה.',
    benefits: ['נוגד חרדה ודיכאון קל', 'משפר מצב רוח', 'מסייע בשינה ורגיעה'],
    usage: 'חליטה של העלים הטריים או היבשים. טעים מאוד גם כחליטה קרה.',
    precautions: 'עלול להשפיע על פעילות בלוטת התריס בשימוש ממושך.',
    category: 'relaxing',
    imageUrl: 'https://picsum.photos/seed/melissa/600/800'
  },
  {
    id: '7',
    hebrewName: 'סרפד',
    latinName: 'Urtica dioica',
    description: 'צמח מזין מאוד, עשיר בברזל ומינרלים. מצוין לניקוי הגוף.',
    benefits: ['טיפול באנמיה', 'ניקוי רעלים (דטוקס)', 'הקלה על אלרגיות עונתיות'],
    usage: 'חליטה מרוכזת של העלים היבשים, או שילוב העלים הטריים במרק (לאחר חליטה).',
    precautions: 'משתן עדין, יש להקפיד על שתיית מים.',
    category: 'general',
    imageUrl: 'https://picsum.photos/seed/nettle/600/800'
  },
  {
    id: '8',
    hebrewName: 'כורכום',
    latinName: 'Curcuma longa',
    description: 'שורש כתום בעל סגולות נוגדות דלקת חזקות במיוחד.',
    benefits: ['נוגד דלקת חזק', 'תמיכה בכבד', 'שיפור זרימת דם'],
    usage: 'כתוספת למזון (עם פלפל שחור לספיגה), או כתוסף מרוכז.',
    precautions: 'בזהירות לאנשים הנוטלים מדללי דם.',
    category: 'general',
    imageUrl: 'https://picsum.photos/seed/turmeric/600/800'
  },
  {
    id: '9',
    hebrewName: 'פסיפלורה',
    latinName: 'Passiflora incarnata',
    description: 'העלים והפרחים משמשים להרגעה עדינה וטיפול בנדודי שינה.',
    benefits: ['הרגעה כללית', 'טיפול בנדודי שינה', 'הפחתת מחשבות טורדניות'],
    usage: 'חליטה או טינקטורה לפני השינה.',
    precautions: 'לא מומלץ לשלב עם תרופות הרגעה ללא ייעוץ.',
    category: 'relaxing',
    imageUrl: 'https://picsum.photos/seed/passiflora/600/800'
  },
    {
    id: '10',
    hebrewName: 'ג׳ינג׳ר',
    latinName: 'Zingiber officinale',
    description: 'שורש מחמם, מצוין לבחילות ובעיות עיכול.',
    benefits: ['הקלה על בחילות', 'שיפור זרימת דם פריפרית', 'אנטי-דלקתי'],
    usage: 'חליטה של השורש הטרי, או שילוב בבישול.',
    precautions: 'בזהירות במצבים של צרבות קשות (חריף).',
    category: 'digestive',
    imageUrl: 'https://picsum.photos/seed/ginger/600/800'
  }
];

export const ARTICLES: Article[] = [
  {
    id: '101',
    title: 'חיזוק המערכת החיסונית בחורף',
    summary: 'כיצד צמחי מרפא יכולים לעזור לנו לעבור את החורף בשלום? סקירה של צמחים מחממים ומחזקים.',
    content: 'תוכן המאמר המלא...',
    date: '2023-11-15',
    imageUrl: 'https://picsum.photos/seed/winter/800/600',
    type: 'article',
    tags: ['חורף', 'מערכת חיסון', 'תזונה']
  },
  {
    id: '102',
    title: 'מקרה בוחן: טיפול באטופיק דרמטיטיס',
    summary: 'סיפורה של מטופלת בת 7 שסבלה מפריחות עוריות קשות, והשיפור שהושג באמצעות שילוב של משחות טבעיות ותזונה.',
    content: 'תיאור המקרה...',
    date: '2023-10-01',
    imageUrl: 'https://picsum.photos/seed/skin/800/600',
    type: 'case_study',
    tags: ['עור', 'ילדים', 'תזונה']
  },
  {
    id: '103',
    title: 'צמחים לשינה טובה יותר',
    summary: 'סובלים מנדודי שינה? הכירו את חמשת הצמחים שיעזרו לכם להירדם בקלות.',
    content: 'תוכן המאמר...',
    date: '2023-09-20',
    imageUrl: 'https://picsum.photos/seed/sleep/800/600',
    type: 'article',
    tags: ['שינה', 'סטרס']
  }
];