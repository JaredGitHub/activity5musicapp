import { getAlbum } from '../../../lib/albums';
import EditAlbum from '../../../EditAlbum';
import { notFound } from 'next/navigation';

export default async function EditPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = await getAlbum(albumId);
  if (!album) notFound();
  return <EditAlbum album={album} />;
}
