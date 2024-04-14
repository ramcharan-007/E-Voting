import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from 'firebase/database';


const firebaseConfig = {  
    // apiKey: "AIzaSyDlbNaaEb43in0ugKN8fTDvEyemX8cmSSU",
    // authDomain: "e-votingsystem-975f4.firebaseapp.com",
    // databaseURL: "https://e-votingsystem-975f4-default-rtdb.asia-southeast1.firebasedatabase.app",
    // projectId: "e-votingsystem-975f4",
    // storageBucket: "e-votingsystem-975f4.appspot.com",
    // messagingSenderId: "63693762063",
    // appId: "1:63693762063:web:5d8520f5b959ce73907d7a",
    // measurementId: "G-RFVS7NPFCD"

    apiKey: "AIzaSyDutpFdFbMHmMmL1Bp2-HgSF_nM8Erft3A",
    authDomain: "e-votingproject.firebaseapp.com",
    databaseURL: "https://e-votingproject-default-rtdb.firebaseio.com",
    projectId: "e-votingproject",
    storageBucket: "e-votingproject.appspot.com",
    messagingSenderId: "41375519745",
    appId: "1:41375519745:web:67147a205c3d9bac78dc00",
    measurementId: "G-VE5QVGGSG2"
};


if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig)
}

const db = getDatabase();

export {firebase, db};