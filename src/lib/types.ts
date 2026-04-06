export interface Track {
  title: string;
  lyrics?: string;
  video?: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  description: string;
  year: string | number;
  image: string;
  tracks: Track[];
}
