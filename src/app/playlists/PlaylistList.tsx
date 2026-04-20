'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PlaylistCard from '@/PlaylistCard';
import EditAlbumsModal from './EditAlbumsModal';

interface PlaylistRow {
  id: number;
  name: string;
  description: string | null;
  albumImages: (string | null)[];
}

export default function PlaylistList({ playlists }: { playlists: PlaylistRow[] }) {
  const router = useRouter();
  const [editingPlaylistId, setEditingPlaylistId] = useState<number | null>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="container">
      <div>
        <h2 className="mb-0">Playlists</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => router.push('/playlists/new')}>
            Create Playlist
          </button>
        )}
      </div>
      

      <div className="d-flex flex-wrap gap-3">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlistId={playlist.id}
            name={playlist.name}
            description={playlist.description}
            albumImages={playlist.albumImages}
            onClick={(id, uri) => router.push(uri + id)}
            onEdit={(id) => setEditingPlaylistId(id)}
          />
        ))}
      </div>

      {editingPlaylistId !== null && (
        <EditAlbumsModal
          playlistId={editingPlaylistId}
          onClose={() => setEditingPlaylistId(null)}
        />
      )}
    </div>
  );
}
