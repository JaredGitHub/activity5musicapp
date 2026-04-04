import SearchForm from './SearchForm';
import AlbumList from './AlbumList';
import { Album } from './types';

interface SearchAlbumProps {
  updateSearchResults: (phrase: string) => void;
  albumList: Album[];
  updateSingleAlbum: (albumId: number, uri: string) => void;
}

const SearchAlbum = (props: SearchAlbumProps) => {
    return (
        <div className="container">
            <SearchForm onSubmit={props.updateSearchResults} />
            <AlbumList albumList={props.albumList} onClick={props.updateSingleAlbum} />
        </div>
    );
};

export default SearchAlbum;
