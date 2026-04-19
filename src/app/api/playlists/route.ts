import { NextRequest, NextResponse } from 'next/server';
import * as playlistService from '@/lib/services/playlistService';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const playlists = await playlistService.getPlaylists();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error('GET /api/playlists error:', error);
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;
    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }
    const playlist = await playlistService.createPlaylist(name, description ?? null);
    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error('POST /api/playlists error:', error);
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
