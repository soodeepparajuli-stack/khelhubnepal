import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { MOCK_NEWS } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug');
  if (!rawSlug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {}

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isPlaceholder) {
    const article = MOCK_NEWS.find(n => n.slug === slug);
    if (article) {
      article.views = (article.views || 0) + 1;
      return NextResponse.json({ success: true, views: article.views });
    }
    return NextResponse.json({ success: true, views: 1 });
  }

  try {
    const supabase = createAdminClient();

    // First try the increment_views RPC function
    const { error: rpcError } = await supabase.rpc('increment_views', { article_slug: slug });

    // Fallback if RPC fails or is missing in Supabase
    if (rpcError) {
      const { data: currentArticle } = await supabase
        .from('news')
        .select('id, views')
        .eq('slug', slug)
        .single();

      if (currentArticle) {
        const nextViews = (currentArticle.views || 0) + 1;
        await supabase
          .from('news')
          .update({ views: nextViews })
          .eq('id', currentArticle.id);

        return NextResponse.json({ success: true, views: nextViews });
      }
    }

    // Fetch the updated views
    const { data: updated } = await supabase
      .from('news')
      .select('views')
      .eq('slug', slug)
      .single();

    return NextResponse.json({ success: true, views: updated?.views ?? 1 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to increment views' }, { status: 500 });
  }
}
