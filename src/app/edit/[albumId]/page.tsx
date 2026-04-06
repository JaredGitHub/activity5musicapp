import { getAlbum } from '../../../lib/data';
import EditAlbum from '../../../EditAlbum';
import { notFound } from 'next/navigation';

export default async function EditPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = getAlbum(albumId);
  if (!album) notFound();
  return <EditAlbum album={album} />;
}
