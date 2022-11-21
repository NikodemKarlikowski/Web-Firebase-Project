import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD0BiUBZnQG4lMG7CbH7MCklTh6TCV2thI",
    authDomain: "nextjs-webapp-nk.firebaseapp.com",
    projectId: "nextjs-webapp-nk",
    storageBucket: "nextjs-webapp-nk.appspot.com",
    messagingSenderId: "571737030496",
    appId: "1:571737030496:web:09f8a3426c657d96e92805",
    measurementId: "G-XWMX4JP7JN"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

//export const auth = getAuth();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp =firebase.firestore.FieldValue.serverTimestamp;

export const increment = firebase.firestore.FieldValue.increment;


export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,

        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}
