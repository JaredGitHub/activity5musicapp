export type Track = {
  id: number;
  number: number;
  title: string;
  lyrics: string | null;
  video: string | null;
};

export type Album = {
  id: number;
  title: string;
  artist: string;
  description: string | null;
  year: number;
  image: string | null;
  tracks: Track[];
};
