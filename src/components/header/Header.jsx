import React, { useState, useEffect } from "react";
import logo from "../../img/logo.png";
import "./Header.scss"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              setUserLoggedIn(true); // Устанавливаем состояние как true, если пользователь авторизован
              const uid = user.uid;
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              setUserLoggedIn(false); // Устанавливаем состояние как false, если пользователь не авторизован
              console.log("user is logged out")
            }
          });
         
    }, [])

    const navigate = useNavigate();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
    
  return (
        <header >
            <a href="/"><img class="logo" src={logo} alt="MAP"></img></a>
            {!userLoggedIn && <a className="btn btn-primary" href="/login">Войти</a>}
            {userLoggedIn &&<div class="row menu"><a href="lk"><button className="btn btn-primary">Личный кабинет</button></a>
              <button className="btn btn-primary" onClick={handleLogout}>Выйти</button></div>}
        </header>
  )
}
 
export default Header