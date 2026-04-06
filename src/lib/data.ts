import fs from 'fs';
import path from 'path';
import { Album } from '../types';

const dataFilePath = path.join(process.cwd(), 'src', 'albums.json');

export function getAlbums(): Album[] {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}

export function getAlbum(id: string): Album | null {
  const albums = getAlbums();
  return albums.find((a) => String(a.id) === id) ?? null;
}
