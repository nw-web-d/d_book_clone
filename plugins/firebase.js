import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/messaging'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyC1Pp4wPcZ50YrwzI3_bdBzm2eStgY2514',
    authDomain: 'd-clone-6137e.firebaseapp.com',
    databaseURL: 'https://d-clone-6137e.firebaseio.com',
    projectId: 'd-clone-6137e',
    storageBucket: 'd-clone-6137e.appspot.com',
    messagingSenderId: '683566632767',
    appId: '1:683566632767:web:fd42ae6832eadb42e00d8a',
    measurementId: 'G-DEQDYXXZSK'
  })
}

export default firebase
