// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBLxGd2aalAtvAHU_x5_U2ZS5L_wjYE3LA",
    authDomain: "my-ecommerce-c7cda.firebaseapp.com",
    projectId: "my-ecommerce-c7cda",
    storageBucket: "my-ecommerce-c7cda.firebasestorage.app",
    messagingSenderId: "281103721174",
    appId: "1:281103721174:web:8ba1c9ddb2cafd93615f77",
    measurementId: "G-GKRWYHR57G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// fire store
const db = getFirestore(app)
export { app, db }