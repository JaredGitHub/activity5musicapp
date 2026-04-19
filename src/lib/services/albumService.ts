import { getPool } from '../db';
import * as albumRepo from '../repositories/albumRepository';
import { Album, Track } from '../types';

export async function getAlbums(): Promise<Album[]> {
  return albumRepo.findAllAlbums();
}

export async function getAlbum(id: number): Promise<Album | null> {
  return albumRepo.findAlbumById(id);
}

export async function createAlbum(data: {
  title: string;
  artist: string;
  year: number;
  description?: string | null;
  image?: string | null;
  tracks?: Track[];
}): Promise<number> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const albumId = await albumRepo.insertAlbum(data, client);
    for (const t of data.tracks ?? []) {
      if (t.title == null || t.number == null) continue;
      await albumRepo.insertTrack(albumId, t, client);
    }
    await client.query('COMMIT');
    return albumId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateAlbum(
  id: number,
  data: {
    title: string;
    artist: string;
    year: number;
    description?: string | null;
    image?: string | null;
    tracks?: Track[];
  }
): Promise<boolean> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const found = await albumRepo.updateAlbumRow(id, data, client);
    if (!found) {
      await client.query('ROLLBACK');
      return false;
    }
    for (const t of data.tracks ?? []) {
      if (t.id == null) continue;
      await albumRepo.updateTrackRow(t.id!, id, t, client);
    }
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAlbum(id: number): Promise<boolean> {
  return albumRepo.deleteAlbumById(id);
}
