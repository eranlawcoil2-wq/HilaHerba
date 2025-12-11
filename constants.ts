import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'בית', path: '/' },
  { label: 'מרכז הידע', path: '/knowledge' }, // Unified page
  { label: 'אודות', path: '/about' },
  { label: 'צור קשר', path: '/contact' },
];

export const THEME_COLORS = {
  primary: '#2F4F2F', // Forest Green
  secondary: '#8FBC8F', // Dark Sea Green
  accent: '#D2B48C', // Tan
  background: '#FAF9F6', // Off White
  text: '#1A202C',
};

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'הכל',
  relaxing: 'הרגעה',
  digestive: 'עיכול',
  immune: 'חיסון',
  skin: 'עור',
  general: 'כללי'
};

export const TYPE_LABELS: Record<string, string> = {
  all: 'כל התכנים',
  plant: 'צמחי מרפא',
  article: 'מאמרים',
  case_study: 'מקרי בוחן'
};