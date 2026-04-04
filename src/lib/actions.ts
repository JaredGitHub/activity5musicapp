'use server';

import fs from 'fs';
import path from 'path';
import { Album } from '../types';

const dataFilePath = path.join(process.cwd(), 'src', 'albums.json');

function readAlbums(): Album[] {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}

function writeAlbums(albums: Album[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(albums, null, 2));
}

export async function getAlbums(): Promise<Album[]> {
  return readAlbums();
}

export async function getAlbum(id: string): Promise<Album | null> {
  const albums = readAlbums();
  return albums.find((a) => String(a.id) === id) ?? null;
}

export async function createAlbum(data: Omit<Album, 'id'>): Promise<Album> {
  const albums = readAlbums();
  const newAlbum: Album = {
    ...data,
    id: albums.length > 0 ? Math.max(...albums.map((a) => a.id)) + 1 : 0,
  };
  albums.push(newAlbum);
  writeAlbums(albums);
  return newAlbum;
}

export async function updateAlbum(id: string, data: Partial<Album>): Promise<Album | null> {
  const albums = readAlbums();
  const index = albums.findIndex((a) => String(a.id) === id);
  if (index === -1) return null;
  albums[index] = { ...albums[index], ...data, id: albums[index].id };
  writeAlbums(albums);
  return albums[index];
}
