// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "omthakurio",
  appId: "1:533967395296:web:664e0efe2df1c210107385",
  storageBucket: "omthakurio.appspot.com",
  apiKey: "AIzaSyC9RVeGLScPS8c8mCWi1giOjMyxgbrlhTI",
  authDomain: "omthakurio.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "533967395296"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
