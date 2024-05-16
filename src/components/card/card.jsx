import './card.scss'
import { Link } from 'react-router-dom';

function Card({id, img, name,description,price}) {
    return <div className="card row">
        <div className="image">
            <img alt='' src={`../../../img/${img}`}></img>
        </div>

        <div className="info column">
            <h2 className='name'>{name}</h2>
            <p className='desc'>{description}</p>
            <p className='price'>Стоимость: {price} руб.</p>
            <Link to={`/courses/${id}`} className="btn">
          Подробнее
        </Link>
        </div>
    </div>;
}

export default Card;