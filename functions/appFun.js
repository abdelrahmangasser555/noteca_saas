import React from "react";
import { notesCollection, userId } from "../firebase.js";
export default async function createNewNote() {
  const newNote = {
    body: "put the name of your note here",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const newNoteRef = await addDoc(notesCollection, newNote);
  setCurrentNoteId(newNoteRef.id);
  setCreatedAt(Date.now());
}
export default async function deleteNote(noteId , db , userId) {
  const docRef = doc(db, userId, noteId);
  await deleteDoc(docRef);
}