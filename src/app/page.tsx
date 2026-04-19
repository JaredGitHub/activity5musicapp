export const dynamic = 'force-dynamic';

import { getAlbums } from '@/lib/services/albumService';
import AlbumSearch from './AlbumSearch';

export default async function Home() {
  const albums = await getAlbums();
  return <AlbumSearch albums={albums} />;
}
