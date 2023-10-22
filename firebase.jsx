import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOqbcxLDmDrLMt24bftCQmV1Ruer71Oqs",
  authDomain: "noteka-e6006.firebaseapp.com",
  projectId: "noteka-e6006",
  storageBucket: "noteka-e6006.appspot.com",
  messagingSenderId: "3233878146",
  appId: "1:3233878146:web:3c9f2c618d775352fce49b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
