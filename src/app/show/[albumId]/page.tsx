'use client';

import { useState, useEffect } from 'react';
import OneAlbum from '../../../OneAlbum';
import { Album } from '../../../types';

export default function ShowPage({ params }: { params: Promise<{ albumId: string }> }) {
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    params.then(({ albumId }) =>
      fetch(`/api/albums/${albumId}`).then((res) => res.json()).then(setAlbum)
    );
  }, [params]);

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <OneAlbum album={album} />;
}
