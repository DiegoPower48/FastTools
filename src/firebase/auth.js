import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { auth } from "@/firebase/config";
const googleProvider = new GoogleAuthProvider();

export const login = async (email, password, callback) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    callback({ success: true, user: userCredential.user });
  } catch (error) {
    callback({ success: false, error });
  }
};

export const register = async (email, password, callback) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return;
  } catch (error) {
    callback(error);
  }
};

export const loginWithGoogle = async (callback) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const docRef = doc(db, "users", user.uid);
    const exists = (await getDoc(docRef)).exists();

    if (!exists) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
        createdAt: Date.now(),
      });
    }

    callback({ success: true, user });
  } catch (error) {
    callback({ success: false, error });
  }
};

export const logout = async () => {
  if (window.__UNSUB_FIRESTORE__) {
    try {
      window.__UNSUB_FIRESTORE__();
      delete window.__UNSUB_FIRESTORE__;
    } catch (e) {}
  }
  await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
