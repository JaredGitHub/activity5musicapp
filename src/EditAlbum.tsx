'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Album } from './types';

interface EditAlbumProps {
  album: Album;
}

const EditAlbum = (props: EditAlbumProps) => {
  const [albumTitle, setAlbumTitle] = useState(props.album.title);
  const [artist, setArtist] = useState(props.album.artist);
  const [description, setDescription] = useState(props.album.description ?? '');
  const [year, setYear] = useState(String(props.album.year));
  const [image, setImage] = useState(props.album.image ?? '');
  const router = useRouter();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const editAlbum = {
      title: albumTitle,
      artist,
      description,
      year,
      image,
      tracks: [],
    };
    saveAlbum(editAlbum);
  };

  const saveAlbum = async (album: object) => {
    await fetch(`/api/albums/${props.album.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album),
    });
    router.push('/');
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <h1>Edit Album</h1>
        <div className="form-group">
          <label htmlFor="albumTitle">Album Title</label>
          <input
            type="text"
            className="form-control"
            id="albumTitle"
            value={albumTitle}
            placeholder="Enter Album Title"
            onChange={(e) => setAlbumTitle(e.target.value)}
          />

          <label htmlFor="albumArtist">Artist</label>
          <input
            type="text"
            className="form-control"
            id="albumArtist"
            value={artist}
            placeholder="Enter Album Artist"
            onChange={(e) => setArtist(e.target.value)}
          />

          <label htmlFor="albumDescription">Description</label>
          <textarea
            className="form-control"
            id="albumDescription"
            value={description}
            placeholder="Enter Album Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="albumYear">Year</label>
          <input
            type="text"
            className="form-control"
            id="albumYear"
            value={year}
            placeholder="Enter Album Year"
            onChange={(e) => setYear(e.target.value)}
          />

          <label htmlFor="albumImage">Image</label>
          <input
            type="text"
            className="form-control"
            id="albumImage"
            value={image}
            placeholder="Enter Album Image"
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="mt-3 text-center">
          <button type="button" className="btn btn-light" onClick={() => router.push('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlbum;
