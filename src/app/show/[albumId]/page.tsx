'use client';

import { useState, useEffect } from 'react';
import OneAlbum from '../../../OneAlbum';
import dataSource from '../../../dataSource';
import { Album } from '../../../types';

export default function ShowPage({ params }: { params: { albumId: string } }) {
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    dataSource.get<Album>('/albums/' + params.albumId).then((res) => setAlbum(res.data));
  }, [params.albumId]);

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <OneAlbum album={album} />;
}
