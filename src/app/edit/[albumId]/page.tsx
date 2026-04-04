'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditAlbum from '../../../EditAlbum';
import dataSource from '../../../dataSource';
import { Album } from '../../../types';

export default function EditPage({ params }: { params: { albumId: string } }) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    dataSource.get<Album>('/albums/' + params.albumId).then((res) => setAlbum(res.data));
  }, [params.albumId]);

  const onEditAlbum = () => {
    router.push('/');
  };

  if (!album) return <div className="container"><p>Loading...</p></div>;

  return <EditAlbum onEditAlbum={onEditAlbum} album={album} />;
}
