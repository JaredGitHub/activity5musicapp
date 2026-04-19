import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  }
  try {
    const pool = getPool();
    const albumRes = await pool.query('SELECT * FROM albums WHERE id = $1', [idNum]);
    if (albumRes.rows.length === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    const album = albumRes.rows[0];

    const tracksRes = await pool.query(
      'SELECT * FROM tracks WHERE album_id = $1 ORDER BY number',
      [idNum]
    );
    const tracks: Track[] = tracksRes.rows.map(track => ({
      id: track.id,
      number: track.number,
      title: track.title,
      lyrics: track.lyrics,
      video: track.video_url,
    }));

    const result: Album = {
      id: album.id,
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/albums/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const { title, artist, year, description, image, tracks } = body;

    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(
        `UPDATE albums SET title=$1, artist=$2, description=$3, year=$4, image=$5 WHERE id=$6 RETURNING id`,
        [title, artist, description ?? null, year, image ?? null, idNum]
      );
      if (res.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }

      if (Array.isArray(tracks)) {
        for (const t of tracks as Track[]) {
          if (t.id == null) continue;
          await client.query(
            `UPDATE tracks SET number=$1, title=$2, lyrics=$3, video_url=$4 WHERE id=$5 AND album_id=$6`,
            [t.number, t.title, t.lyrics ?? null, t.video ?? null, t.id, idNum]
          );
        }
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Album updated successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`PUT /api/albums/${idNum} transaction error:`, err);
      return NextResponse.json({ error: 'Error updating album' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`PUT /api/albums/${idNum} parse error:`, error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  }
  try {
    const pool = getPool();
    const del = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [idNum]);
    if (del.rowCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Album ${idNum} deleted` });
  } catch (error) {
    console.error(`DELETE /api/albums/${idNum} error:`, error);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
