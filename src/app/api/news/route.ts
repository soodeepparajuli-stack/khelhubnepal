import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';
import { MOCK_NEWS } from '@/lib/mockData';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token?.value;
}

const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

// GET - fetch all news (admin)
export async function GET(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isPlaceholder) {
    return NextResponse.json({ data: MOCK_NEWS, count: MOCK_NEWS.length });
  }

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !data) {
      return NextResponse.json({ data: MOCK_NEWS, count: MOCK_NEWS.length });
    }

    return NextResponse.json({ data, count });
  } catch {
    return NextResponse.json({ data: MOCK_NEWS, count: MOCK_NEWS.length });
  }
}

// POST - create news article
export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (isPlaceholder) {
    // Return mock created article if supabase is not yet configured
    const newArticle = {
      id: `news-${Date.now()}`,
      ...body,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json({ data: newArticle }, { status: 201 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('news')
      .insert([{
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category_id: body.category_id || null,
        category_name: body.category_name || null,
        category_slug: body.category_slug || null,
        image_url: body.image_url || null,
        author: body.author || 'KhelHub Nepal',
        published_at: body.published_at || new Date().toISOString(),
        is_featured: body.is_featured || false,
        is_breaking: body.is_breaking || false,
        is_published: body.is_published !== false,
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT - update news article
export async function PUT(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (isPlaceholder) {
    return NextResponse.json({ data: { id, ...updateData } });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('news')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE - delete news article
export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  if (isPlaceholder) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
