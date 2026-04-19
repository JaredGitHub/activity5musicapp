'use client';
import { useSession } from "next-auth/react";

interface CardProps {
    albumId: number;
    title: string;
    description: string | null;
    buttonText: string;
    image: string | null;
    onClick: (albumId: number, uri: string) => void;
    viewUri?: string;
    editUri?: string;
}




const Card = (props: CardProps) => {
    const viewUri = props.viewUri ?? '/show/';
    const editUri = props.editUri ?? '/edit/';

    const handleButtonClick = (uri: string) => {
        props.onClick(props.albumId, uri);
    };

    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={props.image ?? '/placeholder.png'} className="card-img-top" alt="title" />
            <div className='card-body'>
                <h5 className='card-title'>{props.title}</h5>
                <p className='card-text'>{props.description}</p>
                <button
                    onClick={() => handleButtonClick(viewUri)}
                    className='btn btn-primary'
                >
                    {props.buttonText}
                </button>

                {isAdmin && (
                    <button
                        onClick={() => handleButtonClick(editUri)}
                        className='btn btn-secondary'
                    >
                        Edit
                    </button>
                )}

            </div>
        </div>
    );
};

export default Card;
