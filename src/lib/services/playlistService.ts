import * as playlistRepo from '../repositories/playlistRepository';
import { Playlist } from '../types';
import { PlaylistSummary } from '../repositories/playlistRepository';

export async function getPlaylists(): Promise<Playlist[]> {
  return playlistRepo.findAllPlaylists();
}

export async function getPlaylistSummaries(): Promise<PlaylistSummary[]> {
  return playlistRepo.findAllPlaylistSummaries();
}

export async function getPlaylist(id: number): Promise<Playlist | null> {
  return playlistRepo.findPlaylistById(id);
}

export async function createPlaylist(
  name: string,
  description: string | null
): Promise<Playlist> {
  return playlistRepo.insertPlaylist(name, description);
}

export async function updatePlaylist(
  id: number,
  name: string,
  description: string | null
): Promise<Playlist | null> {
  const found = await playlistRepo.updatePlaylistRow(id, name, description);
  if (!found) return null;
  return playlistRepo.findPlaylistById(id);
}

export async function deletePlaylist(id: number): Promise<boolean> {
  return playlistRepo.deletePlaylistById(id);
}

export async function addAlbumToPlaylist(
  playlistId: number,
  albumId: number
): Promise<Playlist | null> {
  await playlistRepo.addAlbumToPlaylist(playlistId, albumId);
  return playlistRepo.findPlaylistById(playlistId);
}
