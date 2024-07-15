import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firestore = getFirestore(app);
