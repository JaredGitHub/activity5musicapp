import Card from './Card';
import { Album } from './types';

interface AlbumListProps {
  albumList: Album[];
  onClick: (albumId: number, uri: string) => void;
}

const AlbumList = (props: AlbumListProps) => {
    const albums = props.albumList.map((album) => {
        return (
            <Card
                key={album.id}
                albumId={album.id}
                title={album.title}
                description={album.description}
                buttonText='View'
                image={album.image}
                onClick={props.onClick}
            />
        );
    });

    return <div className="container">{albums}</div>;
};

export default AlbumList;
