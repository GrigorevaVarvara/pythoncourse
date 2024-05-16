import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './profile.scss'; // Импортируем файл стилей как модуль

import profilePhoto from "../../img/profilePhoto.png";

const Profile = () => {
    return (
        <div className="container card">
            <section className="row">
                   <div className="column profile">
                        <div className="row">
                            <img src={profilePhoto}></img>
                            <div className="column">
                                <h3>Привет, Пользователь!</h3>
                                <p className='white'>Пройдено занятий:</p>
                            </div>
                            
                        </div>
                         
                      
                      <h3>Прогресс:</h3>
                      <a className='btn'>Редактировать профиль</a>
                   </div>
                   <div className='line'></div>
                    <div className="column profile">
                        <a>Курс Phytone</a>
                        <a>Курс основы машинного обучения</a>
                        <a>Библиотеки Scrapy и BeautifulSoup</a>
                        <a>Поддержка</a>
                    </div>
            </section>
        </div>
    );
};

export default Profile;
