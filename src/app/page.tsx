export const dynamic = 'force-dynamic';

import { getAlbums } from '../lib/albums';
import AlbumSearch from './AlbumSearch';

export default async function Home() {
  const albums = await getAlbums();
  return <AlbumSearch albums={albums} />;
}
