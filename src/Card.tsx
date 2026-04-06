'use client';

interface CardProps {
  albumId: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  onClick: (albumId: number, uri: string) => void;
}

const Card = (props: CardProps) => {
    const handleButtonClick = (uri: string) => {
        props.onClick(props.albumId, uri);
    };

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={props.image} className="card-img-top" alt="title" />
            <div className='card-body'>
                <h5 className='card-title'>{props.title}</h5>
                <p className='card-text'>{props.description}</p>
                <button
                    onClick={() => handleButtonClick('/show/')}
                    className='btn btn-primary'
                >
                    {props.buttonText}
                </button>
                <button
                    onClick={() => handleButtonClick('/edit/')}
                    className='btn btn-secondary'
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default Card;
