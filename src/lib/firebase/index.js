import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBSMufU9gxj5qyPge6UgDORlJm0sLZXSeQ",
  authDomain: "task-app-faed4.firebaseapp.com",
  projectId: "task-app-faed4",
  storageBucket: "task-app-faed4.appspot.com",
  messagingSenderId: "505503051840",
  appId: "1:505503051840:web:00b0dc6ea3816fe4c4efa5",
  measurementId: "G-8R6F190JH2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;
  const q = query(collection(db, "users"), where("uid", "==", user.uid));
  const docs = await getDocs(q);
  if (docs.docs.length === 0) {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: user.displayName,
      authProvider: "google",
      email: user.email,
    });
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};
const registerWithEmailAndPassword = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(res.user);
};
const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
  alert("Password reset link sent!");
};
const logout = () => {
  signOut(auth);
};

const messaging = getMessaging();

const requestPermission = () => {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("permission denied - no notifications");
    }
  });
};

const startFirebaseMessaging = (uid) => {
  getToken(messaging, {
    vapidKey:
      "BLxc8iw6ehuBXt3ldupe1knjg7iQXwjsdJcX646DPsV3EHFQEnFYU4mzE7qXenwAZ50uRPwVhtte-kDwSn3DQVQ",
  })
    .then(async (currentToken) => {
      if (currentToken) {
        try {
          // Add the FCMToken property to the user's document in firestore
          const q = query(collection(db, "users"), where("uid", "==", uid));
          const docs = await getDocs(q);

          if (docs.docs.length >= 0) {
            const result = await updateDoc(docs.docs[0].ref, {
              FCMToken: currentToken,
            });
            return result;
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        } catch (e) {
          console.error(e);
        }
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export {
  app,
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  requestPermission,
  startFirebaseMessaging,
};
