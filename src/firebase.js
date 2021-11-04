import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getFirestore } from '@firebase/firestore'
import 'firebase/compat/storage'

export const app = firebase.initializeApp({
    apiKey: 'AIzaSyBiGYFYldflsNF7bMjwVdHmQfoh7Z_CGfU',
    authDomain: 'rnker-bbda5.firebaseapp.com',
    projectId: 'rnker-bbda5',
    storageBucket: 'rnker-bbda5.appspot.com',
    messagingSenderId: '1025478440118',
    appId: '1:1025478440118:web:ff2e4a15a2d94040f0a217',
})

export const auth = app.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const db = app.firestore()
export const storagee = app.storage()
