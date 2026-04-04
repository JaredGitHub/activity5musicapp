import { Album } from './types';

interface OneAlbumProps {
  album: Album;
}

const OneAlbum = (props: OneAlbumProps) => {
  return (
    <div className='container'>
      <h2>Album Details for {props.album.title}</h2>
      <div className='row'>
        <div className='col col-sm-3'>
          <div className='card'>
            <img
              src={props.album.image}
              className='card-img-top'
              alt={props.album.title}
            />
            <div className='card-body'>
              <h5 className='card-title'>{props.album.title}</h5>
              <p className='card-text'>{props.album.description}</p>
              <div className='list-group'>
                <li>Show the album's tracks here</li>
              </div>
              <a href='/#' className='btn btn-primary'>
                Edit
              </a>
            </div>
          </div>
        </div>
        <div className='col col-sm-9'>
          <div className='card'>
            <p>Show the lyrics of select track here</p>
          </div>
          <div className='card'>
            <p>Show the YouTube Video of select track here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneAlbum;
