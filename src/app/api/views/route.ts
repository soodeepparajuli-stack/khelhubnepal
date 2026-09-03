import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSlug = searchParams.get('slug');
  if (!rawSlug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {}

  const supabase = createAdminClient();
  await supabase.rpc('increment_views', { article_slug: slug });

  return NextResponse.json({ success: true });
}
