export interface Plant {
  id: string;
  hebrewName: string;
  latinName: string;
  description: string;
  benefits: string[];
  usage: string;      // New field for Tabs
  precautions: string; // New field for Tabs
  category: 'relaxing' | 'digestive' | 'immune' | 'skin' | 'general';
  imageUrl: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // HTML or Markdown string
  date: string;
  imageUrl: string;
  type: 'article' | 'case_study';
  tags: string[];
}

export interface NavItem {
  label: string;
  path: string;
}