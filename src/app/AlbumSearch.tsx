'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SearchAlbum from '../SearchAlbum';
import { Album } from '../types';

export default function AlbumSearch({ albums }: { albums: Album[] }) {
  const [searchPhrase, setSearchPhrase] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const filtered = albums.filter((album) =>
    searchPhrase === '' ||
    (album.description ?? '').toLowerCase().includes(searchPhrase.toLowerCase())
  );

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between my-4">
        <h2 className="mb-0">Albums</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => router.push('/new')}>
            Create Album
          </button>
        )}
      </div>
      <SearchAlbum
        updateSearchResults={setSearchPhrase}
        albumList={filtered}
        updateSingleAlbum={(id, uri) => router.push(uri + id)}
      />
    </div>
  );
}
