'use client';

import { useRouter } from 'next/navigation';
import NewAlbum from '../../NewAlbum';

export default function NewPage() {
  const router = useRouter();

  const onNewAlbum = () => {
    router.push('/');
  };

  return <NewAlbum onNewAlbum={onNewAlbum} />;
}
