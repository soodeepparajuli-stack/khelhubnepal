// TypeScript types for KhelHub Nepal News Portal

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  image_url: string | null;
  author: string;
  published_at: string;
  is_featured: boolean;
  is_breaking: boolean;
  is_banner?: boolean;
  is_published: boolean;
  status?: 'published' | 'draft' | 'scheduled';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  bio?: string | null;
  display_order: number;
  email?: string | null;
  phone?: string | null;
  facebook_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Ad {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'footer' | 'in-article' | 'breaking';
  image_url: string | null;
  link_url: string | null;
  code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AdPosition = Ad['position'];

