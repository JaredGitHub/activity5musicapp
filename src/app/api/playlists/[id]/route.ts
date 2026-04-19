import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

async function fetchPlaylistWithAlbums(idNum: number) {
  const pool = getPool();

  const playlistRes = await pool.query('SELECT * FROM playlists WHERE id = $1', [idNum]);
  if (playlistRes.rows.length === 0) return null;

  const joinRes = await pool.query(
    `SELECT a.*, t.id AS track_id, t.number, t.title AS track_title,
            t.lyrics, t.video_url
     FROM playlist_albums pa
     JOIN albums a ON a.id = pa.album_id
     LEFT JOIN tracks t ON t.album_id = a.id
     WHERE pa.playlist_id = $1
     ORDER BY a.id, t.number`,
    [idNum]
  );

  const albumsMap: Record<number, Album> = {};
  for (const row of joinRes.rows) {
    if (!albumsMap[row.id]) {
      albumsMap[row.id] = {
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
      albumsMap[row.id].tracks.push(track);
    }
  }

  const p = playlistRes.rows[0];
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    created_at: p.created_at,
    albums: Object.values(albumsMap),
  };
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  }
  try {
    const playlist = await fetchPlaylistWithAlbums(idNum);
    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }
    return NextResponse.json(playlist);
  } catch (error) {
    console.error(`GET /api/playlists/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const { name, description } = body;
    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const pool = getPool();
    const res = await pool.query(
      `UPDATE playlists SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
      [name, description ?? null, idNum]
    );
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }
    const playlist = await fetchPlaylistWithAlbums(idNum);
    return NextResponse.json(playlist);
  } catch (error) {
    console.error(`PUT /api/playlists/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  }
  try {
    const pool = getPool();
    const del = await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id', [idNum]);
    if (del.rowCount === 0) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Playlist ${idNum} deleted` });
  } catch (error) {
    console.error(`DELETE /api/playlists/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
  }
}

// POST /api/playlists/[id] — add an album to the playlist
// Body: { albumId: number }
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const { albumId } = body;
    if (albumId == null) {
      return NextResponse.json({ error: 'Missing required field: albumId' }, { status: 400 });
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO playlist_albums (playlist_id, album_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [idNum, albumId]
    );
    const playlist = await fetchPlaylistWithAlbums(idNum);
    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }
    return NextResponse.json(playlist);
  } catch (error) {
    console.error(`POST /api/playlists/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to add album to playlist' }, { status: 500 });
  }
}
