// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCldaCfpHqw-euWOdC-x601kpIClAYHk64",
    authDomain: "login-with-firebase-72222.firebaseapp.com",
    databaseURL: "https://login-with-firebase-72222-default-rtdb.firebaseio.com",
    projectId: "login-with-firebase-72222",
    storageBucket: "login-with-firebase-72222.appspot.com",
    messagingSenderId: "158789025569",
    appId: "1:158789025569:web:bbc3bf3c998a41dc648860"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;