import React, { useState, useEffect } from 'react';
import './store.scss';
import Cardlist from '../../components/cardlist/cardlist';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';

const Store = () => {
  const [cards, setCards] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const cardsRef = ref(db, 'cards');
    onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      setCards(formattedData);
    });
  }, []);

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(parseInt(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };

  const filteredCards = cards.filter(card => {
    const nameMatch = card.name.toLowerCase().includes(searchName.toLowerCase());
    const priceMatch = card.price >= minPrice && card.price <= maxPrice;
    return nameMatch && priceMatch;
  });

  return (
    <div className="container">
      <h1>Каталог курсов MAP</h1>

      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input type="text" className="form-control" placeholder="Поиск" id="name" value={searchName} onChange={handleNameChange} />
            </div>
          </form>
        </div>
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="minPrice">Минимальная стоимость:</label>
              <input type="number" className="form-control" min="0" id="minPrice" value={minPrice} onChange={handleMinPriceChange} />
            </div>
            <div className="form-group">
              <label htmlFor="maxPrice">Максимальная стоимость:</label>
              <input type="number" className="form-control" min="0" id="maxPrice" value={maxPrice} onChange={handleMaxPriceChange} />
            </div>
          </form>
        </div>
      </div>

      <Cardlist cards={filteredCards} />
    </div>
  );
};

export default Store;
