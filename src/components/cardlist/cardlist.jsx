import React from 'react';
import './cardlist.scss';
import Card from '../card/card';

function Cardlist({ cards }) {
  return (
    <div className="card-list container mt-4 mb-4">
      <div className="list">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
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


