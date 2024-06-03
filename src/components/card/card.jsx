import './card.scss';
import { Link } from 'react-router-dom';

function Card({ id, imgUrl, name, description, price }) {
  return (
    <div className="course row">
      <div className="image">
        <img alt={name} src={imgUrl} className="course-img" />
      </div>

      <div className="info column">
        <h2 className="name">{name}</h2>
        <p className="desc">{description}</p>
        <p className="price">Стоимость: {price} руб.</p>
        <Link to={`/courses/${id}`} className="btn">
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default Card;
