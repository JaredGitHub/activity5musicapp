import { notFound } from 'next/navigation';
import { getPlaylist } from '@/lib/services/playlistService';
import PlaylistAlbums from './PlaylistAlbums';

export default async function PlaylistShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const playlist = await getPlaylist(idNum);
  if (!playlist) notFound();

  return (
    <div className="container">
      <h2 className="my-4">{playlist.name}</h2>
      {playlist.albums.length === 0
        ? (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <small className="text-muted">No albums yet in this playlist</small>
          </div>
        )
        : <PlaylistAlbums albums={playlist.albums} />}
    </div>
  );
}
