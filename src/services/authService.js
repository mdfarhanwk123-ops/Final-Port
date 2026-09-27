import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const loginAdmin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutAdmin = () => signOut(auth);

export const listenToAuth = (callback) => onAuthStateChanged(auth, callback);