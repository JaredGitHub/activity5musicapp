'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NewPlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    router.push('/playlists');
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Create Playlist</h1>
        <div className="form-group">
          <label htmlFor="playlistName">Name</label>
          <input
            type="text"
            className="form-control"
            id="playlistName"
            placeholder="Enter Playlist Name"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="playlistDescription">Description</label>
          <textarea
            className="form-control"
            id="playlistDescription"
            placeholder="Enter Playlist Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-3 text-center">
          <button type="button" className="btn btn-light" onClick={() => router.push('/playlists')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!name}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlaylist;
