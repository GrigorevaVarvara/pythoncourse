import React, { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './home.scss';
import stars from "../../img/stars.png";
import mainPic from "../../img/MapPicture.png";
import photoPic from "../../img/photoes.png";
import canvaPic from "../../img/canvas.png";

const Home = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
      } else {
        console.log("user is logged out");
      }
    });
  }, []);

  return (
    <section>
      <div className="masthead">
        <main>
          <div className="container">
            <div className="row mainscreen align-items-center">
              <div className="col-md-6">
                <img className="img-fluid" src={mainPic} alt="MAP" />
              </div>
              <div className="col-md-6">
                <h1>Онлайн курсы для изучения программирования</h1>
                <a className="btn btn-primary btn-lg" href="store">Начать учиться</a>
              </div>
            </div>

            <div className="row my-4">
              <div className="col-12">
                <img className="img-fluid" src={stars} alt="stars" />
              </div>
            </div>

            <div className="row about align-items-center">
              <div className="col-md-6">
                <img className="img-fluid" src={photoPic} alt="MAP" />
              </div>
              <div className="col-md-6">
                <h2>О проекте</h2>
                <div className="about-block">
                  <p>MAP - платформа для изучения программирования. А также основ машинного обучения!</p>
                  <p>Что есть на платформе:</p>
                  <ul>
                    <li>Интерактивный учебник с упражнениями</li>
                    <li>Видео курсы</li>
                    <li>Теория по основам машинного обучения</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row my-4">
              <div className="col-12">
                <img className="img-fluid" src={stars} alt="stars" />
              </div>
            </div>

            {/* <div className="row">
              <div className="col-12 text-center">
                <h2>Как пользоваться?</h2>
              </div>
              <div className="col-12">
                <Carousel>
                  <Carousel.Item>
                    <img className="d-block w-100" src={canvaPic} alt="First slide" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img className="d-block w-100" src={mainPic} alt="Second slide" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img className="d-block w-100" src={photoPic} alt="Third slide" />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div> */}

            <div className="row my-4">
              <div className="col-12">
                <hr />
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Home;
