export const dynamic = 'force-dynamic';

import { getPool } from '@/lib/db';
import PlaylistList from './PlaylistList';

interface PlaylistRow {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  albumImages: (string | null)[];
}

async function getPlaylists(): Promise<PlaylistRow[]> {
  const pool = getPool();

  const playlistsRes = await pool.query('SELECT * FROM playlists ORDER BY id');
  if (playlistsRes.rows.length === 0) return [];

  const playlistIds = playlistsRes.rows.map((p: any) => p.id);
  const imagesRes = await pool.query(
    `SELECT pa.playlist_id, a.image
     FROM playlist_albums pa
     JOIN albums a ON a.id = pa.album_id
     WHERE pa.playlist_id = ANY($1)
     ORDER BY pa.playlist_id, a.id`,
    [playlistIds]
  );

  const imagesByPlaylist: Record<number, (string | null)[]> = {};
  for (const row of imagesRes.rows) {
    (imagesByPlaylist[row.playlist_id] ||= []).push(row.image);
  }

  return playlistsRes.rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    created_at: p.created_at,
    albumImages: (imagesByPlaylist[p.id] ?? []).slice(0, 4),
  }));
}

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();
  return <PlaylistList playlists={playlists} />;
}
