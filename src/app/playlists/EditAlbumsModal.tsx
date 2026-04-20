'use client';

import { useEffect, useState } from 'react';
import { Album } from '@/lib/types';

interface EditAlbumsModalProps {
  playlistId: number;
  onClose: () => void;
}

export default function EditAlbumsModal({ playlistId, onClose }: EditAlbumsModalProps) {
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [playlistAlbumIds, setPlaylistAlbumIds] = useState<Set<number>>(new Set());
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/albums').then((r) => r.json()),
      fetch(`/api/playlists/${playlistId}`).then((r) => r.json()),
    ]).then(([albums, playlist]) => {
      setAllAlbums(albums);
      setPlaylistAlbumIds(new Set((playlist.albums ?? []).map((a: Album) => a.id)));
    });
  }, [playlistId]);

  const handleAdd = async (albumId: number) => {
    setPending(albumId);
    await fetch(`/api/playlists/${playlistId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId }),
    });
    setPlaylistAlbumIds((prev) => new Set(prev).add(albumId));
    setPending(null);
  };

  const handleRemove = async (albumId: number) => {
    setPending(albumId);
    await fetch(`/api/playlists/${playlistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId }),
    });
    setPlaylistAlbumIds((prev) => {
      const next = new Set(prev);
      next.delete(albumId);
      return next;
    });
    setPending(null);
  };

  const inPlaylist = allAlbums.filter((a) => playlistAlbumIds.has(a.id));
  const notInPlaylist = allAlbums.filter((a) => !playlistAlbumIds.has(a.id));

  const AlbumRow = ({
    album,
    action,
  }: {
    album: Album;
    action: 'add' | 'remove';
  }) => (
    <li className="list-group-item d-flex align-items-center gap-3">
      <img
        src={album.image ?? '/placeholder.png'}
        alt={album.title}
        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div className="flex-grow-1">
        <div className="fw-semibold">{album.title}</div>
        <small className="text-muted">{album.artist} &middot; {album.year}</small>
      </div>
      <button
        className={`btn btn-sm ${action === 'add' ? 'btn-outline-primary' : 'btn-outline-danger'}`}
        onClick={() => action === 'add' ? handleAdd(album.id) : handleRemove(album.id)}
        disabled={pending === album.id}
      >
        {pending === album.id ? '...' : action === 'add' ? 'Add' : 'Remove'}
      </button>
    </li>
  );

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose} />

      <div className="modal fade show d-block" style={{ zIndex: 1050 }} role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Playlist Albums</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {allAlbums.length === 0 ? (
                <p className="text-muted">Loading albums...</p>
              ) : (
                <div className="row g-3">
                  <div className="col-6">
                    <h6 className="mb-2">Add Albums</h6>
                    {notInPlaylist.length === 0 ? (
                      <p className="text-muted small">All albums are already in this playlist.</p>
                    ) : (
                      <ul className="list-group">
                        {notInPlaylist.map((album) => (
                          <AlbumRow key={album.id} album={album} action="add" />
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="col-6">
                    <h6 className="mb-2">Remove Albums</h6>
                    {inPlaylist.length === 0 ? (
                      <p className="text-muted small">No albums in this playlist yet.</p>
                    ) : (
                      <ul className="list-group">
                        {inPlaylist.map((album) => (
                          <AlbumRow key={album.id} album={album} action="remove" />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
