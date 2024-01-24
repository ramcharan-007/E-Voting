import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from 'firebase/database';


const firebaseConfig = {  
    apiKey: "AIzaSyDlbNaaEb43in0ugKN8fTDvEyemX8cmSSU",
    authDomain: "e-votingsystem-975f4.firebaseapp.com",
    databaseURL: "https://e-votingsystem-975f4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "e-votingsystem-975f4",
    storageBucket: "e-votingsystem-975f4.appspot.com",
    messagingSenderId: "63693762063",
    appId: "1:63693762063:web:5d8520f5b959ce73907d7a",
    measurementId: "G-RFVS7NPFCD"
};


if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig)
}

const db = getDatabase();

export {firebase, db};