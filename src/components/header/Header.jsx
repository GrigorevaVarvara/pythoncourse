import React, { useState, useEffect } from "react";
import logo from "../../img/logo.png";
import "./Header.scss"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
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
        <Navbar expand="lg" className="header">
            <Container>
                <Navbar.Brand href="/">
                    <img className="logo" src={logo} alt="MAP" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto button-group">
                        <Nav.Link className="btn btn-primary mx-2" href="/store">Магазин</Nav.Link>
                        {!userLoggedIn ? (
                            <>
                                <Nav.Link className="btn btn-primary mx-2" href="/signup">Зарегистрироваться</Nav.Link>
                                <Nav.Link className="btn btn-primary mx-2" href="/login">Войти</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link className="btn btn-primary mx-2" href="/lk">Личный кабинет</Nav.Link>
                                <Nav.Link className="btn btn-primary mx-2" onClick={handleLogout}>Выйти</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
