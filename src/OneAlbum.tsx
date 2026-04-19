import { Album } from './types';

interface OneAlbumProps {
  album: Album;
}

const OneAlbum = (props: OneAlbumProps) => {
  return (
    <div className='container'>
      
      <div className='row'>
        <h2>Album Details for {props.album.title}</h2>
        <div className='col col-sm-3'>
          <div className='card'>
            <img
              src={props.album.image ?? undefined }
              className='card-img-top'
              alt={props.album.title}
            />
            <div className='card-body'>
              <h5 className='card-title'>{props.album.title}</h5>
              <p className='card-text'>{props.album.description}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default OneAlbum;
