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
            <div className="header-content d-flex justify-content-between align-items-center">
                <a href="/"><img className="logo" src={logo} alt="MAP"></img></a>
                <div className="button-group d-flex align-items-center">
                    <a className="btn btn-primary mx-2" href="/store">Магазин</a>
                    {!userLoggedIn ? (
                        <>
                            <a className="btn btn-primary mx-2" href="/signup">Зарегистрироваться</a>
                            <a className="btn btn-primary mx-2" href="/login">Войти</a>
                        </>
                    ) : (
                        <>
                            <a className="btn btn-primary mx-2" href="/lk">Личный кабинет</a>
                            <a className="btn btn-primary mx-2" onClick={handleLogout}>Выйти</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
 
export default Header;
