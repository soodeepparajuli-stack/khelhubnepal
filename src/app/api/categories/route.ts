import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { generateSlug } from '@/lib/data';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token?.value;
}

const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

// In-memory array for demo mode so additions persist during session
let demoCategories = [...MOCK_CATEGORIES];

export async function GET() {
  if (isPlaceholder) {
    return NextResponse.json({ data: demoCategories });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: demoCategories });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: demoCategories });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const name = body.name?.trim();
  const slug = (body.slug?.trim() || generateSlug(name)).toLowerCase();
  const color = body.color?.trim() || '#e31e24';

  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  if (isPlaceholder) {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      color,
      created_at: new Date().toISOString(),
    };
    demoCategories.push(newCategory);
    return NextResponse.json({ data: newCategory }, { status: 201 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, color }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, slug, color } = body;

  if (!id) return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });

  if (isPlaceholder) {
    demoCategories = demoCategories.map(c =>
      c.id === id ? { ...c, name: name || c.name, slug: slug || c.slug, color: color || c.color } : c
    );
    const updated = demoCategories.find(c => c.id === id);
    return NextResponse.json({ data: updated });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, color })
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

export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  if (isPlaceholder) {
    demoCategories = demoCategories.filter(c => c.id !== id);
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
