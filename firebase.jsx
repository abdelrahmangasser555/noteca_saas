import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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
export let userId;
if (!localStorage.getItem("userId")) {
  localStorage.setItem("userId", uuidv4());
} else {
  userId = localStorage.getItem("userId");
}

const userCollection = collection(db, userId);

export const notesCollection = userCollection;
