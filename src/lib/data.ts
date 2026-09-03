import { NewsArticle, Category, Ad } from '@/types';
import { supabase } from './supabase';
import { MOCK_CATEGORIES, MOCK_NEWS, MOCK_ADS } from './mockData';

const isPlaceholderSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example');

// ─── NEWS ─────────────────────────────────────────────────────────────

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => n.is_featured);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(5);
    if (error || !data || data.length === 0) return MOCK_NEWS.filter(n => n.is_featured);
    return data;
  } catch {
    return MOCK_NEWS.filter(n => n.is_featured);
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => n.is_breaking);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('is_breaking', true)
      .order('published_at', { ascending: false })
      .limit(10);
    if (error || !data || data.length === 0) return MOCK_NEWS.filter(n => n.is_breaking);
    return data as NewsArticle[];
  } catch {
    return MOCK_NEWS.filter(n => n.is_breaking);
  }
}

export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) return MOCK_NEWS.slice(0, limit);
    return data;
  } catch {
    return MOCK_NEWS.slice(0, limit);
  }
}

export async function getNewsByCategory(categorySlug: string, limit = 8): Promise<NewsArticle[]> {
  if (isPlaceholderSupabase) {
    const filtered = MOCK_NEWS.filter(n => n.category_slug === categorySlug);
    return filtered.slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('category_slug', categorySlug)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) {
      return MOCK_NEWS.filter(n => n.category_slug === categorySlug).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_NEWS.filter(n => n.category_slug === categorySlug).slice(0, limit);
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.find(n => n.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error || !data) return MOCK_NEWS.find(n => n.slug === slug) || null;
    return data;
  } catch {
    return MOCK_NEWS.find(n => n.slug === slug) || null;
  }
}

export async function getRelatedNews(categorySlug: string, excludeSlug: string, limit = 5): Promise<NewsArticle[]> {
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => n.category_slug === categorySlug && n.slug !== excludeSlug).slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .eq('category_slug', categorySlug)
      .neq('slug', excludeSlug)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) {
      return MOCK_NEWS.filter(n => n.category_slug === categorySlug && n.slug !== excludeSlug).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_NEWS.filter(n => n.category_slug === categorySlug && n.slug !== excludeSlug).slice(0, limit);
  }
}

// ─── CATEGORIES ───────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (isPlaceholderSupabase) {
    return MOCK_CATEGORIES;
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return MOCK_CATEGORIES;
    return data;
  } catch {
    return MOCK_CATEGORIES;
  }
}

// ─── ADS ──────────────────────────────────────────────────────────────

export async function getAdsByPosition(position: string): Promise<Ad[]> {
  if (isPlaceholderSupabase) {
    return MOCK_ADS.filter(a => a.position === position && a.is_active);
  }
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('position', position)
      .eq('is_active', true);
    if (error || !data || data.length === 0) {
      return MOCK_ADS.filter(a => a.position === position && a.is_active);
    }
    return data;
  } catch {
    return MOCK_ADS.filter(a => a.position === position && a.is_active);
  }
}

export async function getAllActiveAds(): Promise<Ad[]> {
  if (isPlaceholderSupabase) {
    return MOCK_ADS.filter(a => a.is_active);
  }
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true);
    if (error || !data || data.length === 0) return MOCK_ADS.filter(a => a.is_active);
    return data;
  } catch {
    return MOCK_ADS.filter(a => a.is_active);
  }
}

// ─── SEARCH ───────────────────────────────────────────────────────────

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
      (n.category_name && n.category_name.toLowerCase().includes(q))
    );
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .ilike('title', `%${q}%`)
      .order('published_at', { ascending: false })
      .limit(20);
    if (error || !data) {
      return MOCK_NEWS.filter(n => n.title.toLowerCase().includes(q));
    }
    return data;
  } catch {
    return MOCK_NEWS.filter(n => n.title.toLowerCase().includes(q));
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'भर्खरै';
  if (minutes < 60) return `${minutes} मिनेट अघि`;
  if (hours < 24) return `${hours} घण्टा अघि`;
  if (days < 7) return `${days} दिन अघि`;

  return date.toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateEn(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateSlug(title: string): string {
  const clean = title
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 60);

  return `${clean || 'news'}-${Date.now()}`;
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%231a2357'/%3E%3Ctext x='400' y='250' fill='%23e31e24' font-size='48' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-weight='bold'%3EKhelHub Nepal%3C/text%3E%3C/svg%3E";
