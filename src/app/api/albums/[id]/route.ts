import { NextRequest, NextResponse } from 'next/server';
import * as albumService from '@/lib/services/albumService';

export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

async function parseId(context: Context): Promise<number | null> {
  const { id } = await context.params;
  const n = parseInt(id, 10);
  return isNaN(n) ? null : n;
}

export async function GET(_req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  try {
    const album = await albumService.getAlbum(id);
    return album
      ? NextResponse.json(album)
      : NextResponse.json({ error: 'Album not found' }, { status: 404 });
  } catch (error) {
    console.error(`GET /api/albums/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  try {
    const { title, artist, year, description, image, tracks } = await req.json();
    const found = await albumService.updateAlbum(id, { title, artist, year, description, image, tracks });
    return found
      ? NextResponse.json({ message: 'Album updated successfully' })
      : NextResponse.json({ error: 'Album not found' }, { status: 404 });
  } catch (error) {
    console.error(`PUT /api/albums/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  try {
    const found = await albumService.deleteAlbum(id);
    return found
      ? NextResponse.json({ message: `Album ${id} deleted` })
      : NextResponse.json({ error: 'Album not found' }, { status: 404 });
  } catch (error) {
    console.error(`DELETE /api/albums/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
