import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database"
import firebaseConfig from "./firebase-config";

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
const realTime = myFirebase.database();
export const db = baseDb;
export default realTime;