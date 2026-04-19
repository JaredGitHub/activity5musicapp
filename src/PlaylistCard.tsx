'use client';
import { useSession } from 'next-auth/react';

interface PlaylistCardProps {
  playlistId: number;
  name: string;
  description: string | null;
  albumImages: (string | null)[];
  onClick: (playlistId: number, uri: string) => void;
  onEdit: (playlistId: number) => void;
  viewUri?: string;
}

const PlaylistCard = (props: PlaylistCardProps) => {
  const viewUri = props.viewUri ?? '/playlists/';

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const images = props.albumImages.slice(0, 4);
  while (images.length < 4) images.push(null);

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '180px' }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src ?? '/placeholder.png'}
            alt=""
            style={{ width: '100%', height: '90px', objectFit: 'cover' }}
          />
        ))}
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">{props.description}</p>
        <button
          onClick={() => props.onClick(props.playlistId, viewUri)}
          className="btn btn-primary"
        >
          View
        </button>
        {isAdmin && (
          <button
            onClick={() => props.onEdit(props.playlistId)}
            className="btn btn-secondary ms-2"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
