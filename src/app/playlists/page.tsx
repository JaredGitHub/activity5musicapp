export const dynamic = 'force-dynamic';

import { getPlaylistSummaries } from '@/lib/services/playlistService';
import PlaylistList from './PlaylistList';

export default async function PlaylistsPage() {
  const playlists = await getPlaylistSummaries();
  return <PlaylistList playlists={playlists} />;
}
