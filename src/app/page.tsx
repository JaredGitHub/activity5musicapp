import { getAlbums } from '../lib/data';
import AlbumSearch from './AlbumSearch';

export default function Home() {
  const albums = getAlbums();
  return <AlbumSearch albums={albums} />;
}
