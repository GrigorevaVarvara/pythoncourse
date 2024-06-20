import './card.scss';
import { Link } from 'react-router-dom';

function Card({ id, imgUrl, name, description, price }) {
  return (
    <div className="course row mb-4">
      <div className="col-12 col-md-4 mb-3 mb-md-0">
        <img alt={name} src={imgUrl} className="course-img img-fluid" />
      </div>

      <div className="col-12 col-md-8">
        <h2 className="name text-dark">{name}</h2>
        <p className="desc">{description}</p>
        <p className="price">Стоимость: {price} руб.</p>
        <Link to={`/courses/${id}`} className="btn btn-primary">
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default Card;
