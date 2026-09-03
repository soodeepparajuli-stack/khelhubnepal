import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  const supabase = createAdminClient();
  await supabase.rpc('increment_views', { article_slug: slug });

  return NextResponse.json({ success: true });
}
