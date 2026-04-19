'use client';

import { useEffect, useState } from 'react';
import { Album } from '@/lib/types';

interface AddAlbumsModalProps {
  playlistId: number;
  onClose: () => void;
}

export default function AddAlbumsModal({ playlistId, onClose }: AddAlbumsModalProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [adding, setAdding] = useState<number | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/albums')
      .then((r) => r.json())
      .then(setAlbums);
  }, []);

  const handleAdd = async (albumId: number) => {
    setAdding(albumId);
    await fetch(`/api/playlists/${playlistId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId }),
    });
    setAdded((prev) => new Set(prev).add(albumId));
    setAdding(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Albums to Playlist</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {albums.length === 0 ? (
                <p className="text-muted">Loading albums...</p>
              ) : (
                <ul className="list-group">
                  {albums.map((album) => (
                    <li
                      key={album.id}
                      className="list-group-item d-flex align-items-center gap-3"
                    >
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
                        className={`btn btn-sm ${added.has(album.id) ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => handleAdd(album.id)}
                        disabled={adding === album.id || added.has(album.id)}
                      >
                        {added.has(album.id) ? 'Added' : adding === album.id ? '...' : 'Add'}
                      </button>
                    </li>
                  ))}
                </ul>
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
