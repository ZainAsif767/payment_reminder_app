import firebase from "firebase/compat/app";

// importScripts(
//     "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
// );
// importScripts(
//     "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
// );


// firebase.initializeApp(firebaseConfig);
// console.log("At service worker!")
// const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//     console.log("Message received. ", payload);
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//     }

//     if (Notification.permission === "granted")
//         new Notification(notificationTitle, notificationOptions)
//     else if (Notification.permission === "denied") {
//         Notification.requestPermission().then((permission) => {
//             if (permission === "granted") {
//                 new Notification(notificationTitle, notificationOptions)
//             }
//         })
//     }

// })



// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-messaging-compat.js');


// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
    apiKey: "AIzaSyDSxYae6HwLhzOSv7bAsG8KP5NrZ-PynDw",
    authDomain: "payment-reminder-app-b1f7c.firebaseapp.com",
    projectId: "payment-reminder-app-b1f7c",
    storageBucket: "payment-reminder-app-b1f7c.appspot.com",
    messagingSenderId: "1046232119776",
    appId: "1:1046232119776:web:65d881bc8981924fd39385",
    measurementId: "G-0EEJSPRDPX"
};

firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
console.log("in service worker")
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log("Received message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    if (Notification.permission === "granted")
        new Notification(notificationTitle, notificationOptions)
    else if (Notification.permission === "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(notificationTitle, notificationOptions)
            }
        })
    }

});