import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import './login.scss';
 
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/lk")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }
 
    return(
        
            <div>

<div class=" container row center">

        <div class="card">
            <div class="card-body">
                
                <div class="row">
                    
                        <div class="column column_center">
                            <div class="text-center">
                                <h2>Авторизация</h2>
                            </div>


                            <form class="user column column_center">                                              
                            <div class="form-group">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    class="form-field form-control"                                    
                                    required                                                                                
                                    placeholder="Эл.почта"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div class="form-group">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"  
                                    class="form-field form-control"                                   
                                    required                                                                                
                                    placeholder="Пароль"
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                                                
                            <div>
                                <button                                    
                                    onClick={onLogin}
                                    class="btn"                                        
                                >      
                                    Войти                                                                  
                                </button>
                            </div>                               
                        </form>
                       
                        <p class="white">
                            Нет, аккаунта?  {' '}
                            <NavLink to="/signup" class="link">
                            Зарегистрируйтесь, сейчас!
                            </NavLink>
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
        
    )
}
 
export default Login