/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDSxYae6HwLhzOSv7bAsG8KP5NrZ-PynDw",
    authDomain: "payment-reminder-app-b1f7c.firebaseapp.com",
    projectId: "payment-reminder-app-b1f7c",
    storageBucket: "payment-reminder-app-b1f7c.appspot.com",
    messagingSenderId: "1046232119776",
    appId: "1:1046232119776:web:65d881bc8981924fd39385",
    measurementId: "G-0EEJSPRDPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

const loginInWithEmailAndPassword = async (email: any, password: any) => {
    try {
        console.log(email, password);
        const userCredentials: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredentials.user.getIdToken();
        return { user: userCredentials.user, token }
    } catch (error) {
        console.error(error)
    }
}

const registerWithEmailAndPassword = async (name: any, email: any, password: any) => {
    try {
        console.log(email, name, password)
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

const sendPasswordReset = async (email: any) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Reset Password Link sent!")
    } catch (error) {
        console.error(error)
        alert(error.message)
    }
}

const logout = () => {
    signOut(auth);
}

export {
    auth, database, loginInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout, messaging
}