'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchAlbum from '../SearchAlbum';
import dataSource from '../dataSource';
import { Album } from '../types';

export default function Home() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    const response = await dataSource.get<Album[]>('/albums');
    setAlbumList(response.data);
  };

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
