/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

const loginInWithEmailAndPassword = async (email: any, password: any) => {
    try {
        const userCredentials: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredentials.user.getIdToken();
        return { user: userCredentials.user, token }
    } catch (error) {
        console.error(error)
    }
}

const registerWithEmailAndPassword = async (name: any, email: any, password: any) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user;
        return await addDoc(collection(database, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email
        });
    } catch (error) {
        console.error(error)
        alert(error.message);
    }
}

const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const token = await user.getIdToken();
        return { user, token }
    } catch (error) {
        console.error(error)
    }
}

const sendPasswordReset = async (email: any) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error(error)
        alert(error.message)
    }
}

const logout = () => {
    signOut(auth);
}

export {
    auth, database, loginInWithEmailAndPassword, loginWithGoogle, registerWithEmailAndPassword, sendPasswordReset, logout, messaging
}