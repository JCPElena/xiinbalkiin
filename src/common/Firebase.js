import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

//credenciales
const firebaseConfig = {
    apiKey: "AIzaSyDQfDYBxTCte63b7qyaLgO6Ysh_KCaiZBw",
    authDomain: "xiinbalkiin.firebaseapp.com",
    databaseURL: "https://xiinbalkiin.firebaseio.com",
    projectId: "xiinbalkiin",
    storageBucket: "xiinbalkiin.appspot.com",
    messagingSenderId: "280991191678",
    appId: "1:280991191678:web:be2e59be8544e8faff3e2f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //instancia que nos permite la conexion a la base de datos.
  const db = firebase.firestore();
  

  const storage = firebase.storage().ref();


   export { db, storage };