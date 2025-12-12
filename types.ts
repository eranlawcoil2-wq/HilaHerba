
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
  date?: string; // Added for "Last Updated" feature
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

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  type: 'recipe';
  tags: string[];
  tabs: ContentTab[]; 
}

export type ContentItem = 
  | (Plant & { type: 'plant' }) 
  | Article
  | Recipe;

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
