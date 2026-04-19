import { NextRequest, NextResponse } from 'next/server';
import * as albumService from '@/lib/services/albumService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const albumIdParam = new URL(request.url).searchParams.get('albumId');
    if (albumIdParam) {
      const id = parseInt(albumIdParam, 10);
      if (isNaN(id)) return NextResponse.json({ error: 'Invalid albumId' }, { status: 400 });
      const album = await albumService.getAlbum(id);
      return album
        ? NextResponse.json([album])
        : NextResponse.json([], { status: 200 });
    }
    const albums = await albumService.getAlbums();
    return NextResponse.json(albums);
  } catch (error) {
    console.error('GET /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artist, year, description, image, tracks } = body;
    if (!title || !artist || year == null) {
      return NextResponse.json({ error: 'Missing required fields: title, artist, year' }, { status: 400 });
    }
    const id = await albumService.createAlbum({ title, artist, year, description, image, tracks });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { albumId, title, artist, year, description, image, tracks } = body;
    if (albumId == null) {
      return NextResponse.json({ error: 'Missing albumId' }, { status: 400 });
    }
    const found = await albumService.updateAlbum(albumId, { title, artist, year, description, image, tracks });
    return found
      ? NextResponse.json({ message: 'Album updated successfully' })
      : NextResponse.json({ error: 'Album not found' }, { status: 404 });
  } catch (error) {
    console.error('PUT /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}
