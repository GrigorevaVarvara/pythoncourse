import React, { useState } from 'react';
import './store.scss';

import Cardlist from '../../components/cardlist/cardlist';

const Store = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      img: 'placeholder.jpeg',
      name: 'Курс по React',
      description: 'Изучите основы React и создайте свои первые веб-приложения.',
      price: 200,
    },
    {
      id: 2,
      img: 'placeholder.jpeg',
      name: 'Курс по JavaScript',
      description: 'Погрузитесь в мир JavaScript и освойте его настоящие силы.',
      price: 150,
    },
    {
      id: 3,
      img: 'placeholder.jpeg',
      name: 'Курс по Python',
      description: 'Начните свой путь с Python и станьте опытным разработчиком.',
      price: 180,
    },
  ]);

  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

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
    // Фильтрация по названию
    const nameMatch = card.name.toLowerCase().includes(searchName.toLowerCase());
    // Фильтрация по стоимости
    const priceMatch = card.price >= minPrice && card.price <= maxPrice;
    return nameMatch && priceMatch;
  });

  return (
    <div className="container">
      <h1>Каталог курсов MAP</h1>

      <div className="inputs">
        <form action="">
          <div className="name">
            <label htmlFor="name">Название</label>
            <input type="text" placeholder="Поиск" id="name" value={searchName} onChange={handleNameChange}></input>
          </div>
          <div className="price">
            <label>Минимальная стоимость:</label>
            <input type="number" min="0" value={minPrice} onChange={handleMinPriceChange} />
            <label>Максимальная стоимость:</label>
            <input type="number" min="0" value={maxPrice} onChange={handleMaxPriceChange} />
          </div>
        </form>
      </div>

      <Cardlist cards={filteredCards} />
    </div>
  );
};

export default Store;
