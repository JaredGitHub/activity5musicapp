import { getPool } from './db';
import { Album, Track } from '../types';

export async function getAlbums(): Promise<Album[]> {
  const pool = getPool();
  const albumsRes = await pool.query('SELECT * FROM albums ORDER BY id');
  if (albumsRes.rows.length === 0) return [];

  const albumIds = albumsRes.rows.map((a: any) => a.id);
  const tracksRes = await pool.query(
    'SELECT * FROM tracks WHERE album_id = ANY($1) ORDER BY number',
    [albumIds]
  );

  const tracksByAlbum: Record<number, Track[]> = {};
  for (const track of tracksRes.rows) {
    (tracksByAlbum[track.album_id] ||= []).push({
      id: track.id,
      number: track.number,
      title: track.title,
      lyrics: track.lyrics,
      video: track.video_url,
    });
  }

  return albumsRes.rows.map((album: any) => ({
    id: album.id,
    title: album.title,
    artist: album.artist,
    year: album.year,
    image: album.image,
    description: album.description,
    tracks: tracksByAlbum[album.id] || [],
  }));
}

export async function getAlbum(id: string): Promise<Album | null> {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return null;

  const pool = getPool();
  const albumRes = await pool.query('SELECT * FROM albums WHERE id = $1', [idNum]);
  if (albumRes.rows.length === 0) return null;

  const album = albumRes.rows[0];
  const tracksRes = await pool.query(
    'SELECT * FROM tracks WHERE album_id = $1 ORDER BY number',
    [idNum]
  );

  const tracks: Track[] = tracksRes.rows.map((track: any) => ({
    id: track.id,
    number: track.number,
    title: track.title,
    lyrics: track.lyrics,
    video: track.video_url,
  }));

  return {
    id: album.id,
    title: album.title,
    artist: album.artist,
    year: album.year,
    image: album.image,
    description: album.description,
    tracks,
  };
}
