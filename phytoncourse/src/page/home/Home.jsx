import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';
import './home.scss';
import stars from "../../img/stars.png";
import mainPic from "../../img/MapPicture.png";
import photoPic from "../../img/photoes.png";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css'; // Import the CSS for default styles

 
const Home = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("uid", uid)
      } else {
        // User is signed out
        console.log("user is logged out")
      }
    });
  }, [])

  return (
    <section>
      <div className="masthead">
        <main>
          <div className="container row mainscreen">
            <img className="map-pic" src={mainPic} alt="MAP" />
            <div className="column course">
              <h1>Бесплатные онлайн курсы для изучения Python</h1>
              <a className="btn btn-primary btn-big" href="store">Начать учиться</a>
            </div>
          </div>

          <img className="container row separator" src={stars} alt="stars" />

          <div className="container row about">
            <img className="about-pic" src={photoPic} alt="MAP" />
            <div>
              <h2>О проекте </h2>
              <div className="about-block">
                <p>MAP - платформа для изучения Python. А также основ машинного обучения!</p>
                <p>Что есть на платформе:</p>
                <ul>
                  <li>Интерактивный учебник Python со 100 упражнениями</li>
                  <li>Видео курсы</li>
                  <li>Теория по основам машинного обучения</li>
                </ul>
              </div>
            </div>
          </div>

          <img className="container row separator" src={stars} alt="stars" />

          <div className="container column">
            <h2>Как пользоваться?</h2>

            {/* Use AwesomeSlider here */}
            <AwesomeSlider animation="cubeAnimation">
              <div data-src="../../img/canva.png" />
              <div data-src="../../img/MapPicture.png" />
              <div data-src="../../img/MapPicture.png" />
            </AwesomeSlider>
          </div>

          <div className="separator"></div>
        </main>
      </div>
    </section>
  )
}

export default Home;
