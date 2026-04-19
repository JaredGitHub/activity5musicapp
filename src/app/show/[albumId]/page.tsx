import { getAlbum } from '../../../lib/albums';
import OneAlbum from '../../../OneAlbum';
import { notFound } from 'next/navigation';

export default async function ShowPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = await getAlbum(parseInt(albumId, 10));
  if (!album) notFound();
  return <OneAlbum album={album} />;
}
