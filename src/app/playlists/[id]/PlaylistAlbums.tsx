'use client';

import { useRouter } from 'next/navigation';
import AlbumList from '@/AlbumList';
import { Album } from '@/lib/types';

export default function PlaylistAlbums({ albums }: { albums: Album[] }) {
  const router = useRouter();
  return (
    <AlbumList
      albumList={albums}
      onClick={(albumId, uri) => router.push(uri + albumId)}
    />
  );
}
