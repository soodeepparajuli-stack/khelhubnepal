import { NewsArticle, Category, Ad, TeamMember } from '@/types';
import { supabase } from './supabase';
import { MOCK_CATEGORIES, MOCK_NEWS, MOCK_ADS, MOCK_TEAM } from './mockData';

const isPlaceholderSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example');

const isPubliclyVisible = (n: NewsArticle) =>
  n.is_published && (!n.published_at || new Date(n.published_at).getTime() <= Date.now());

// ─── NEWS ─────────────────────────────────────────────────────────────

export async function getBannerNews(): Promise<NewsArticle[]> {
  const nowIso = new Date().toISOString();
  if (isPlaceholderSupabase) {
    const banners = MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_banner);
    return banners.length > 0 ? banners : MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_featured).slice(0, 1);
  }
  try {
    // Attempt to query with is_banner
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .eq('is_banner', true)
      .order('published_at', { ascending: false })
      .limit(5);

    if (!error && data && data.length > 0) return data;

    // If is_banner column doesn't return anything or doesn't exist, fallback to featured
    const { data: featData, error: featErr } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(2);

    if (!featErr && featData && featData.length > 0) return featData;
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && (n.is_banner || n.is_featured)).slice(0, 2);
  } catch {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && (n.is_banner || n.is_featured)).slice(0, 2);
  }
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  const nowIso = new Date().toISOString();
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_featured);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(5);
    if (error || !data || data.length === 0) return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_featured);
    return data;
  } catch {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_featured);
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const nowIso = new Date().toISOString();
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_breaking);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .eq('is_breaking', true)
      .order('published_at', { ascending: false })
      .limit(10);
    if (error || !data || data.length === 0) return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_breaking);
    return data as NewsArticle[];
  } catch {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.is_breaking);
  }
}

export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  const nowIso = new Date().toISOString();
  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(isPubliclyVisible).slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) return MOCK_NEWS.filter(isPubliclyVisible).slice(0, limit);
    return data;
  } catch {
    return MOCK_NEWS.filter(isPubliclyVisible).slice(0, limit);
  }
}

export async function getNewsByCategory(categorySlug: string, limit = 8): Promise<NewsArticle[]> {
  let decodedCat = categorySlug;
  try {
    decodedCat = decodeURIComponent(categorySlug);
  } catch {}
  const catsToTry = Array.from(new Set([decodedCat, categorySlug]));
  const nowIso = new Date().toISOString();

  if (isPlaceholderSupabase) {
    const filtered = MOCK_NEWS.filter(n => isPubliclyVisible(n) && catsToTry.includes(n.category_slug || ''));
    return filtered.slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .in('category_slug', catsToTry)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) {
      return MOCK_NEWS.filter(n => isPubliclyVisible(n) && catsToTry.includes(n.category_slug || '')).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && catsToTry.includes(n.category_slug || '')).slice(0, limit);
  }
}

export async function getNewsBySlug(rawSlug: string): Promise<NewsArticle | null> {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {}
  const slugsToTry = Array.from(new Set([decodedSlug, rawSlug]));

  if (isPlaceholderSupabase) {
    return MOCK_NEWS.find(n => slugsToTry.includes(n.slug)) || null;
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .in('slug', slugsToTry)
      .eq('is_published', true)
      .limit(1);
    if (error || !data || data.length === 0) {
      return MOCK_NEWS.find(n => slugsToTry.includes(n.slug)) || null;
    }
    return data[0];
  } catch {
    return MOCK_NEWS.find(n => slugsToTry.includes(n.slug)) || null;
  }
}

export async function getRelatedNews(categorySlug: string, excludeSlug: string, limit = 5): Promise<NewsArticle[]> {
  let decodedExclude = excludeSlug;
  try {
    decodedExclude = decodeURIComponent(excludeSlug);
  } catch {}
  const excludes = Array.from(new Set([decodedExclude, excludeSlug]));
  const nowIso = new Date().toISOString();

  if (isPlaceholderSupabase) {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.category_slug === categorySlug && !excludes.includes(n.slug)).slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .lte('published_at', nowIso)
      .eq('category_slug', categorySlug)
      .not('slug', 'in', `(${excludes.join(',')})`)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data || data.length === 0) {
      return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.category_slug === categorySlug && !excludes.includes(n.slug)).slice(0, limit);
    }
    return data;
  } catch {
    return MOCK_NEWS.filter(n => isPubliclyVisible(n) && n.category_slug === categorySlug && !excludes.includes(n.slug)).slice(0, limit);
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

// ─── TEAM MEMBERS ──────────────────────────────────────────────────

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isPlaceholderSupabase) {
    return MOCK_TEAM;
  }
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return MOCK_TEAM;
    return data;
  } catch {
    return MOCK_TEAM;
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
