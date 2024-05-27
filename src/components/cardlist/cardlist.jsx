import Card from '../card/card';
import './cardlist.scss';

function Cardlist({ cards }) {
  return (
    <div className="card-list container mt-4 mb-4"> {/* Added Bootstrap spacing utilities */}
      <div className="list">
        {cards.map((card) => (
          <Card
            img={card.img}
            name={card.name}
            description={card.description}
            price={card.price}
          />
        ))}
      </div>
    </div>
  );
}

export default Cardlist;
