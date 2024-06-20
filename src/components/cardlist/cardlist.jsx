import React from 'react';
import './cardlist.scss';
import Card from '../card/card';

function Cardlist({ cards }) {
  return (
    <div className="card-list container mt-4 mb-4">
      <div className="row">
        {cards.map((card) => (
          <div key={card.id} className="col-12 col-md-6 mb-4">
            <Card
              id={card.id}
              imgUrl={card.imgUrl}
              name={card.name}
              description={card.description}
              price={card.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardlist;
