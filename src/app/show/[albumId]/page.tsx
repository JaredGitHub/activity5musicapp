import { getAlbum } from '../../../lib/data';
import OneAlbum from '../../../OneAlbum';
import { notFound } from 'next/navigation';

export default async function ShowPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = getAlbum(albumId);
  if (!album) notFound();
  return <OneAlbum album={album} />;
}
