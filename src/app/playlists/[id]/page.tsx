import { notFound } from 'next/navigation';
import { getPool } from '@/lib/db';
import { Album, Track } from '@/lib/types';
import PlaylistAlbums from './PlaylistAlbums';

async function getPlaylistWithAlbums(id: number): Promise<{ name: string; albums: Album[] } | null> {
  const pool = getPool();

  const playlistRes = await pool.query('SELECT * FROM playlists WHERE id = $1', [id]);
  if (playlistRes.rows.length === 0) return null;

  const joinRes = await pool.query(
    `SELECT a.*, t.id AS track_id, t.number, t.title AS track_title,
            t.lyrics, t.video_url
     FROM playlist_albums pa
     JOIN albums a ON a.id = pa.album_id
     LEFT JOIN tracks t ON t.album_id = a.id
     WHERE pa.playlist_id = $1
     ORDER BY a.id, t.number`,
    [id]
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
      albumsMap[row.id].tracks.push({
        id: row.track_id,
        number: row.number,
        title: row.track_title,
        lyrics: row.lyrics,
        video: row.video_url,
      });
    }
  }

  return {
    name: playlistRes.rows[0].name,
    albums: Object.values(albumsMap),
  };
}

export default async function PlaylistShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const playlist = await getPlaylistWithAlbums(idNum);
  if (!playlist) notFound();

  return (
    <div className="container">
      <h2 className="my-4">{playlist.name}</h2>
      <PlaylistAlbums albums={playlist.albums} />
    </div>
  );
}
