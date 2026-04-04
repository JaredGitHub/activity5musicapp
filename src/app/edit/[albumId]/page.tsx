'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditAlbum from '../../../EditAlbum';
import { getAlbum } from '../../../lib/actions';
import { Album } from '../../../types';

export default function EditPage({ params }: { params: { albumId: string } }) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    getAlbum(params.albumId).then(setAlbum);
  }, [params.albumId]);

  const onEditAlbum = () => {
    router.push('/');
  };

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <EditAlbum onEditAlbum={onEditAlbum} album={album} />;
}
