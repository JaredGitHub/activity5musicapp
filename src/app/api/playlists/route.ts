import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { Album, Playlist, Track } from '@/lib/types';

export const runtime = 'nodejs';

async function fetchPlaylistsWithAlbums(ids?: number[]): Promise<Playlist[]> {
  const pool = getPool();

  const playlistsRes = ids
    ? await pool.query('SELECT * FROM playlists WHERE id = ANY($1) ORDER BY id', [ids])
    : await pool.query('SELECT * FROM playlists ORDER BY id');

  if (playlistsRes.rows.length === 0) return [];

  const playlistIds = playlistsRes.rows.map((p: any) => p.id);

  const joinRes = await pool.query(
    `SELECT pa.playlist_id, a.*, t.id AS track_id, t.number, t.title AS track_title,
            t.lyrics, t.video_url
     FROM playlist_albums pa
     JOIN albums a ON a.id = pa.album_id
     LEFT JOIN tracks t ON t.album_id = a.id
     WHERE pa.playlist_id = ANY($1)
     ORDER BY a.id, t.number`,
    [playlistIds]
  );

  const albumsByPlaylist: Record<number, Record<number, Album>> = {};
  for (const row of joinRes.rows) {
    const pid: number = row.playlist_id;
    if (!albumsByPlaylist[pid]) albumsByPlaylist[pid] = {};
    if (!albumsByPlaylist[pid][row.id]) {
      albumsByPlaylist[pid][row.id] = {
        id: row.id,
        title: row.title,
        artist: row.artist,
        description: row.description,
        year: row.year,
        image: row.image,
        tracks: [],
      };
    }
    if (row.track_id != null) {
      const track: Track = {
        id: row.track_id,
        number: row.number,
        title: row.track_title,
        lyrics: row.lyrics,
        video: row.video_url,
      };
      albumsByPlaylist[pid][row.id].tracks.push(track);
    }
  }

  return playlistsRes.rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    created_at: p.created_at,
    albums: Object.values(albumsByPlaylist[p.id] ?? {}),
  }));
}

export async function GET() {
  try {
    const playlists = await fetchPlaylistsWithAlbums();
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

    const pool = getPool();
    const res = await pool.query(
      `INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description ?? null]
    );
    const playlist: Playlist = { ...res.rows[0], albums: [] };
    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error('POST /api/playlists error:', error);
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
}
