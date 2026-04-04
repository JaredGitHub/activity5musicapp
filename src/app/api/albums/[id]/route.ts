import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Album } from '../../../../types';

const dataFilePath = path.join(process.cwd(), 'src', 'albums.json');

function readAlbums(): Album[] {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}

function writeAlbums(albums: Album[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(albums, null, 2));
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albums = readAlbums();
  const album = albums.find((a) => String(a.id) === id);
  if (!album) return NextResponse.json({ message: 'Album not found' }, { status: 404 });
  return NextResponse.json(album);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albums = readAlbums();
  const index = albums.findIndex((a) => String(a.id) === id);
  if (index === -1) return NextResponse.json({ message: 'Album not found' }, { status: 404 });
  const body = await req.json();
  albums[index] = { ...albums[index], ...body, id: albums[index].id };
  writeAlbums(albums);
  return NextResponse.json(albums[index]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const albums = readAlbums();
  const index = albums.findIndex((a) => String(a.id) === id);
  if (index === -1) return NextResponse.json({ message: 'Album not found' }, { status: 404 });
  const [deleted] = albums.splice(index, 1);
  writeAlbums(albums);
  return NextResponse.json(deleted);
}
