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
              setUserLoggedIn(true); 
              const uid = user.uid;
              console.log("uid", uid);
            } else {
              setUserLoggedIn(false); 
              console.log("user is logged out");
            }
          });
         
    }, []);

    const navigate = useNavigate();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
            navigate("/");
            console.log("Signed out successfully");
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    }
    
    return (
        <header className="header">
            <div className="header-content">
                <a href="/"><img className="logo" src={logo} alt="MAP"></img></a>
                <div className="button-group">
                    {!userLoggedIn && (
                        <div className="menu">
                            <a className="btn btn-primary" href="/signup">Зарегистрироваться</a>
                            <a className="btn btn-primary" href="/login">Войти</a>
                        </div>
                    )}
                    {userLoggedIn && (
                        <div className="menu">
                            <a href="/lk"><button className="btn btn-primary">Личный кабинет</button></a>
                            <button className="btn btn-primary" onClick={handleLogout}>Выйти</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
 
export default Header;
