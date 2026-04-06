import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Album } from '../../../types';

const dataFilePath = path.join(process.cwd(), 'src', 'albums.json');

function readAlbums(): Album[] {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}


export async function GET() {
  return NextResponse.json(readAlbums());
}

export async function POST(req: NextRequest) {
  const albums = readAlbums();
  const body = await req.json();
  const newAlbum: Album = {
    ...body,
    id: albums.length > 0 ? Math.max(...albums.map((a) => a.id)) + 1 : 0,
  };
  return NextResponse.json(newAlbum, { status: 201 });
}
