export interface ContentTab {
  id: string;
  title: string;
  content: string;
}

export interface Plant {
  id: string;
  hebrewName: string;
  latinName: string;
  description: string;
  benefits: string[]; // Still used for tags/quick view
  category: 'relaxing' | 'digestive' | 'immune' | 'skin' | 'general';
  imageUrl: string;
  tabs: ContentTab[]; // Replaces fixed fields like usage/precautions
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  type: 'article' | 'case_study';
  tags: string[];
  tabs: ContentTab[]; // Replaces fixed content field
}

export type ContentItem = 
  | (Plant & { type: 'plant' }) 
  | Article;

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  active: boolean;
  order: number;
}

export interface NavItem {
  label: string;
  path: string;
}