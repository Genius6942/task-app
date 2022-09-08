// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyBSMufU9gxj5qyPge6UgDORlJm0sLZXSeQ”",
  authDomain: "https://5173-genius6942-taskapp-mztdr2zl8cc.ws-us64.gitpod.io/login",
  projectId: "task-app-faed4",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});