import React, {useState, useEffect} from 'react';
import './App.css';
import Home from './page/home/Home';
import Signup from './page/signup/Signup';
import Login from './page/login/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Foooter';
import Profile from './page/profile/Profile';
import Store from './page/store/store';
import Quiz from './page/quiz/Quiz';
import CourseDetails from './page/coursedetails/coursedetails';
import PasswordReset from './page/passwordreset/passwordreset';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-awesome-slider/dist/styles.css';
 
function App() {
  return (
    <Router>
      <div id="root">
        <Header />
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/lk" element={<Profile />} />
            <Route path="/quiz" element={<Quiz/>} />
            <Route path="/store" element={<Store />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
          </Routes>
        </section>
        <Footer />
      </div>
    </Router>
  );
}
 
export default App;