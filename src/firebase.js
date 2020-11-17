import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE42dIhLvG_4OykuNw41QKBe5C-OYGnLU",
  authDomain: "algolia-poc.firebaseapp.com",
  databaseURL: "https://algolia-poc.firebaseio.com",
  projectId: "algolia-poc",
  storageBucket: "algolia-poc.appspot.com",
  messagingSenderId: "877011140927",
  appId: "1:877011140927:web:b243a8b817f4c160e7938a",
  measurementId: "G-Y74VELFBJ6"
};

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const actorsCollection = db.collection('actors')

// export utils/refs
export {
  db,
  auth,
  firebase,
  actorsCollection,
}
