// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0T4XMHEvKNsMj8OgLyK073eM8G1ypMic",
  authDomain: "sportlink58.firebaseapp.com",
  databaseURL: "https://sportlink58-default-rtdb.firebaseio.com",
  projectId: "sportlink58",
  storageBucket: "sportlink58.appspot.com",
  messagingSenderId: "1054234293820",
  appId: "1:1054234293820:web:f0689da092db97711db539",
  measurementId: "G-J2CK79LFP1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//utile pour authentification
export const auth = getAuth(app)

//utile pour la base de donnée
export const db = getFirestore(app)

export const storage = getStorage(app);
