'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditAlbum from '../../../EditAlbum';
import { Album } from '../../../types';

export default function EditPage({ params }: { params: Promise<{ albumId: string }> }) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    params.then(({ albumId }) =>
      fetch(`/api/albums/${albumId}`).then((res) => res.json()).then(setAlbum)
    );
  }, [params]);

  const onEditAlbum = () => {
    router.push('/');
  };

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <EditAlbum onEditAlbum={onEditAlbum} album={album} />;
}
