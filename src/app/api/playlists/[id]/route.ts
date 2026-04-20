import { NextRequest, NextResponse } from 'next/server';
import * as playlistService from '@/lib/services/playlistService';

export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

async function parseId(context: Context): Promise<number | null> {
  const { id } = await context.params;
  const n = parseInt(id, 10);
  return isNaN(n) ? null : n;
}

export async function GET(_req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  try {
    const playlist = await playlistService.getPlaylist(id);
    return playlist
      ? NextResponse.json(playlist)
      : NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  } catch (error) {
    console.error(`GET /api/playlists/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  try {
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    const playlist = await playlistService.updatePlaylist(id, name, description ?? null);
    return playlist
      ? NextResponse.json(playlist)
      : NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  } catch (error) {
    console.error(`PUT /api/playlists/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  try {
    const found = await playlistService.deletePlaylist(id);
    return found
      ? NextResponse.json({ message: `Playlist ${id} deleted` })
      : NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  } catch (error) {
    console.error(`DELETE /api/playlists/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
  }
}

// Remove an album from the playlist. Body: { albumId: number }
export async function PATCH(req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  try {
    const { albumId } = await req.json();
    if (albumId == null) return NextResponse.json({ error: 'Missing required field: albumId' }, { status: 400 });
    const playlist = await playlistService.removeAlbumFromPlaylist(id, albumId);
    return playlist
      ? NextResponse.json(playlist)
      : NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  } catch (error) {
    console.error(`PATCH /api/playlists/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to remove album from playlist' }, { status: 500 });
  }
}

// Add an album to the playlist. Body: { albumId: number }
export async function POST(req: NextRequest, context: Context) {
  const id = await parseId(context);
  if (id === null) return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  try {
    const { albumId } = await req.json();
    if (albumId == null) return NextResponse.json({ error: 'Missing required field: albumId' }, { status: 400 });
    const playlist = await playlistService.addAlbumToPlaylist(id, albumId);
    return playlist
      ? NextResponse.json(playlist)
      : NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  } catch (error) {
    console.error(`POST /api/playlists/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to add album to playlist' }, { status: 500 });
  }
}
