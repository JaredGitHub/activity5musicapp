'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchAlbum from '../SearchAlbum';
import { Album } from '../types';

export default function AlbumSearch({ albums }: { albums: Album[] }) {
  const [searchPhrase, setSearchPhrase] = useState('');
  const router = useRouter();

  const filtered = albums.filter((album) =>
    searchPhrase === '' ||
    (album.description ?? '').toLowerCase().includes(searchPhrase.toLowerCase())
  );

  return (
    <SearchAlbum
      updateSearchResults={setSearchPhrase}
      albumList={filtered}
      updateSingleAlbum={(id, uri) => router.push(uri + id)}
    />
  );
}
