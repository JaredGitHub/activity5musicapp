'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchAlbum from '../SearchAlbum';
import { getAlbums } from '../lib/actions';
import { Album } from '../types';

export default function Home() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAlbums().then(setAlbumList);
  }, []);

  const updateSearchResults = (phrase: string) => {
    setSearchPhrase(phrase);
  };

  const updateSingleAlbum = (id: number, uri: string) => {
    router.push(uri + id);
  };

  const renderedList = albumList.filter((album) =>
    album.description.toLowerCase().includes(searchPhrase.toLowerCase()) ||
    searchPhrase === ''
  );

  return (
    <SearchAlbum
      updateSearchResults={updateSearchResults}
      albumList={renderedList}
      updateSingleAlbum={updateSingleAlbum}
    />
  );
}
