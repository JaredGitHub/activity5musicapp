'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewAlbumProps {
  onNewAlbum: () => void;
}

const NewAlbum = (props: NewAlbumProps) => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const album = {
      title: albumTitle,
      artist,
      description,
      year,
      image,
      tracks: [],
    };
    saveAlbum(album);
  };

  const saveAlbum = async (album: object) => {
    await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album),
    });
    props.onNewAlbum();
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <h1>Create Album</h1>
        <div className="form-group">
          <label htmlFor="albumTitle">Album Title</label>
          <input
            type="text"
            className="form-control"
            id="albumTitle"
            placeholder="Enter Album Title"
            onChange={(e) => setAlbumTitle(e.target.value)}
          />

          <label htmlFor="albumArtist">Artist</label>
          <input
            type="text"
            className="form-control"
            id="albumArtist"
            placeholder="Enter Album Artist"
            onChange={(e) => setArtist(e.target.value)}
          />

          <label htmlFor="albumDescription">Description</label>
          <textarea
            className="form-control"
            id="albumDescription"
            placeholder="Enter Album Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="albumYear">Year</label>
          <input
            type="text"
            className="form-control"
            id="albumYear"
            placeholder="Enter Album Year"
            onChange={(e) => setYear(e.target.value)}
          />

          <label htmlFor="albumImage">Image</label>
          <input
            type="text"
            className="form-control"
            id="albumImage"
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

export default NewAlbum;
