import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';
import { MOCK_TEAM } from '@/lib/mockData';
import { TeamMember } from '@/types';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token?.value;
}

// In-memory store fallback if team_members table doesn't exist in Supabase
let inMemoryTeam: TeamMember[] = [...MOCK_TEAM];

// GET: list all team members
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: inMemoryTeam });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: inMemoryTeam });
  }
}

// POST: add a team member
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, image_url, bio, display_order, email, phone, facebook_url, twitter_url } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and Role are required' }, { status: 400 });
    }

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      image_url: image_url?.trim() || null,
      bio: bio?.trim() || null,
      display_order: Number(display_order) || inMemoryTeam.length + 1,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      facebook_url: facebook_url?.trim() || null,
      twitter_url: twitter_url?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          name: newMember.name,
          role: newMember.role,
          image_url: newMember.image_url,
          bio: newMember.bio,
          display_order: newMember.display_order,
          email: newMember.email,
          phone: newMember.phone,
          facebook_url: newMember.facebook_url,
          twitter_url: newMember.twitter_url,
        }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ data, success: true }, { status: 201 });
      }
    } catch {
      // Supabase table might not exist yet, fallback to in-memory
    }

    // In-memory fallback
    inMemoryTeam.push(newMember);
    return NextResponse.json({ data: newMember, success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create team member';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: update a team member
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, role, image_url, bio, display_order, email, phone, facebook_url, twitter_url } = body;

    if (!id || !name || !role) {
      return NextResponse.json({ error: 'ID, Name, and Role are required' }, { status: 400 });
    }

    const updatePayload = {
      name: name.trim(),
      role: role.trim(),
      image_url: image_url?.trim() || null,
      bio: bio?.trim() || null,
      display_order: Number(display_order) || 1,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      facebook_url: facebook_url?.trim() || null,
      twitter_url: twitter_url?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('team_members')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ data, success: true });
      }
    } catch {
      // Supabase table might not exist yet, fallback to in-memory
    }

    // In-memory fallback
    const idx = inMemoryTeam.findIndex(m => m.id === id);
    if (idx !== -1) {
      inMemoryTeam[idx] = { ...inMemoryTeam[idx], ...updatePayload };
      return NextResponse.json({ data: inMemoryTeam[idx], success: true });
    }

    return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update team member';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: delete a team member
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (!error) {
        return NextResponse.json({ success: true });
      }
    } catch {
      // Supabase fallback
    }

    inMemoryTeam = inMemoryTeam.filter(m => m.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete team member';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
