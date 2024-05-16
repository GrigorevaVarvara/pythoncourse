import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../../firebase';
import './signup.scss';
 
const Signup = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            navigate("/login")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
 
   
    }
 
  return (
    <main >        
        <section>
            <div class=" container row center">
                <div class="card">
                <div class="card-body">
                
                <div class="row">
                    
                        <div class="column column_center" >                  
                        <div class="text-center">
                                <h2>Регистрация</h2>
                            </div>                                                                          
                    <form class="user column column_center">                                                                                            
                        <div class="form-group">
                            <input
                                type="email"
                                label="Email address"
                                class="form-field form-control"   
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Эл.почта"                                
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                label="Create password"
                                class="form-field form-control"   
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Пароль"              
                            />
                        </div>                                             
                        
                        <button
                            type="submit" 
                            onClick={onSubmit}
                            class="btn"                         
                        >  
                            Зарегистрироваться                                
                        </button>
                                                                     
                    </form>
                   
                    <p class="white">
                        Уже есть аккаунт?{' '}
                        <NavLink to="/login" >
                            Войти
                        </NavLink>
                    </p>                   
                </div>
            </div>
            </div>
            </div>
            </div>
        </section>
    </main>
  )
}
 
export default Signup