'use client';

import { useState, useEffect } from 'react';
import OneAlbum from '../../../OneAlbum';
import { getAlbum } from '../../../lib/actions';
import { Album } from '../../../types';

export default function ShowPage({ params }: { params: { albumId: string } }) {
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    getAlbum(params.albumId).then(setAlbum);
  }, [params.albumId]);

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <OneAlbum album={album} />;
}
