/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.FIRE_BASE_API_KEY,
    authDomain: import.meta.env.FIRE_BASE_AUTH_DOMAIN,
    projectId: import.meta.env.FIRE_BASE_PROJECT_ID,
    storageBucket: import.meta.env.FIRE_BASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FIRE_BASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.FIRE_BASE_APP_ID,
    measurementId: import.meta.env.FIRE_BASE_MEASUREMENT_ID
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
        alert(error.message)
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