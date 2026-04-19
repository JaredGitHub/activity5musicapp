import { getPool } from '../db';
import { Album, Playlist, Track } from '../types';

function buildPlaylistsWithAlbums(playlistRows: any[], joinRows: any[]): Playlist[] {
  const albumsByPlaylist: Record<number, Record<number, Album>> = {};
  for (const row of joinRows) {
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
  return playlistRows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    created_at: p.created_at,
    albums: Object.values(albumsByPlaylist[p.id] ?? {}),
  }));
}

const ALBUM_TRACK_JOIN = `
  SELECT pa.playlist_id, a.*, t.id AS track_id, t.number, t.title AS track_title,
         t.lyrics, t.video_url
  FROM playlist_albums pa
  JOIN albums a ON a.id = pa.album_id
  LEFT JOIN tracks t ON t.album_id = a.id
`;

export async function findAllPlaylists(): Promise<Playlist[]> {
  const pool = getPool();
  const playlistsRes = await pool.query('SELECT * FROM playlists ORDER BY id');
  if (playlistsRes.rows.length === 0) return [];
  const ids = playlistsRes.rows.map((p: any) => p.id);
  const joinRes = await pool.query(
    `${ALBUM_TRACK_JOIN} WHERE pa.playlist_id = ANY($1) ORDER BY a.id, t.number`,
    [ids]
  );
  return buildPlaylistsWithAlbums(playlistsRes.rows, joinRes.rows);
}

export async function findPlaylistById(id: number): Promise<Playlist | null> {
  const pool = getPool();
  const playlistRes = await pool.query('SELECT * FROM playlists WHERE id = $1', [id]);
  if (playlistRes.rows.length === 0) return null;
  const joinRes = await pool.query(
    `${ALBUM_TRACK_JOIN} WHERE pa.playlist_id = $1 ORDER BY a.id, t.number`,
    [id]
  );
  return buildPlaylistsWithAlbums(playlistRes.rows, joinRes.rows)[0];
}

export interface PlaylistSummary {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  albumImages: (string | null)[];
}

export async function findAllPlaylistSummaries(): Promise<PlaylistSummary[]> {
  const pool = getPool();
  const playlistsRes = await pool.query('SELECT * FROM playlists ORDER BY id');
  if (playlistsRes.rows.length === 0) return [];
  const ids = playlistsRes.rows.map((p: any) => p.id);
  const imagesRes = await pool.query(
    `SELECT pa.playlist_id, a.image
     FROM playlist_albums pa
     JOIN albums a ON a.id = pa.album_id
     WHERE pa.playlist_id = ANY($1)
     ORDER BY pa.playlist_id, a.id`,
    [ids]
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

export async function insertPlaylist(name: string, description: string | null): Promise<Playlist> {
  const pool = getPool();
  const res = await pool.query(
    `INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description]
  );
  return { ...res.rows[0], albums: [] };
}

export async function updatePlaylistRow(
  id: number,
  name: string,
  description: string | null
): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query(
    `UPDATE playlists SET name=$1, description=$2 WHERE id=$3 RETURNING id`,
    [name, description, id]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deletePlaylistById(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id', [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function addAlbumToPlaylist(playlistId: number, albumId: number): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO playlist_albums (playlist_id, album_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [playlistId, albumId]
  );
}
