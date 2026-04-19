import { Pool, PoolClient } from 'pg';
import { getPool } from '../db';
import { Album, Track } from '../types';

type Conn = Pool | PoolClient;

function rowToTrack(row: any): Track {
  return {
    id: row.track_id ?? row.id,
    number: row.number,
    title: row.track_title ?? row.title,
    lyrics: row.lyrics,
    video: row.video_url,
  };
}

function buildAlbumsFromRows(albumRows: any[], trackRows: any[]): Album[] {
  const tracksByAlbum: Record<number, Track[]> = {};
  for (const row of trackRows) {
    (tracksByAlbum[row.album_id] ||= []).push({
      id: row.id,
      number: row.number,
      title: row.title,
      lyrics: row.lyrics,
      video: row.video_url,
    });
  }
  return albumRows.map((a) => ({
    id: a.id,
    title: a.title,
    artist: a.artist,
    description: a.description,
    year: a.year,
    image: a.image,
    tracks: tracksByAlbum[a.id] ?? [],
  }));
}

export async function findAllAlbums(): Promise<Album[]> {
  const pool = getPool();
  const albumsRes = await pool.query('SELECT * FROM albums ORDER BY id');
  if (albumsRes.rows.length === 0) return [];
  const ids = albumsRes.rows.map((a: any) => a.id);
  const tracksRes = await pool.query(
    'SELECT * FROM tracks WHERE album_id = ANY($1) ORDER BY number',
    [ids]
  );
  return buildAlbumsFromRows(albumsRes.rows, tracksRes.rows);
}

export async function findAlbumById(id: number): Promise<Album | null> {
  const pool = getPool();
  const albumRes = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
  if (albumRes.rows.length === 0) return null;
  const tracksRes = await pool.query(
    'SELECT * FROM tracks WHERE album_id = $1 ORDER BY number',
    [id]
  );
  return buildAlbumsFromRows(albumRes.rows, tracksRes.rows)[0];
}

export async function insertAlbum(
  data: { title: string; artist: string; year: number; description?: string | null; image?: string | null },
  conn: Conn
): Promise<number> {
  const res = await conn.query(
    `INSERT INTO albums (title, artist, description, year, image) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.title, data.artist, data.description ?? null, data.year, data.image ?? null]
  );
  return res.rows[0].id;
}

export async function insertTrack(
  albumId: number,
  track: { title: string; number: number; lyrics?: string | null; video?: string | null },
  conn: Conn
): Promise<void> {
  await conn.query(
    `INSERT INTO tracks (album_id, title, number, lyrics, video_url) VALUES ($1, $2, $3, $4, $5)`,
    [albumId, track.title, track.number, track.lyrics ?? null, track.video ?? null]
  );
}

export async function updateAlbumRow(
  id: number,
  data: { title: string; artist: string; year: number; description?: string | null; image?: string | null },
  conn: Conn
): Promise<boolean> {
  const res = await conn.query(
    `UPDATE albums SET title=$1, artist=$2, description=$3, year=$4, image=$5 WHERE id=$6 RETURNING id`,
    [data.title, data.artist, data.description ?? null, data.year, data.image ?? null, id]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function updateTrackRow(
  trackId: number,
  albumId: number,
  data: { title: string; number: number; lyrics?: string | null; video?: string | null },
  conn: Conn
): Promise<void> {
  await conn.query(
    `UPDATE tracks SET number=$1, title=$2, lyrics=$3, video_url=$4 WHERE id=$5 AND album_id=$6`,
    [data.number, data.title, data.lyrics ?? null, data.video ?? null, trackId, albumId]
  );
}

export async function deleteAlbumById(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);
  return (res.rowCount ?? 0) > 0;
}
