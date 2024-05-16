import React, {useState, useEffect} from 'react';
import Home from './page/home/Home';
import Signup from './page/signup/Signup';
import Login from './page/login/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Foooter';
import Profile from './page/profile/Profile';
import Store from './page/store/store';
import CoursePage from './page/coursepage/coursepage';
 
function App() {
 
  
  return (
    <Router>
      <div>
        <section>
          <Header/>                              
            <Routes>                                                                        
              <Route path="/" element={<Home/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/lk" element={<Profile/>}/>
              <Route path="/store" element={<Store/>}/>
              <Route path="/courses/:id" component={CoursePage} />
            </Routes> 
            <Footer/>                   
        </section>
      </div>
    </Router>
  );
}
 
export default App;