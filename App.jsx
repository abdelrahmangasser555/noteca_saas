import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db, userId } from "./firebase";
import "./style.css";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortArr = notes.sort((a, b) => b.updatedAt - a.updatedAt);
  React.useEffect(() => {
    const hamada = onSnapshot(notesCollection, function (snapShot) {
      const noteArr = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(noteArr);
    });
    return hamada;
  }, []);
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);
  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [tempNoteText]);
  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  async function createNewNote() {
    const newNote = {
      body: "put the name of your note here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
    setCreatedAt(Date.now());
  }

  async function updateNote(text) {
    const docRef = doc(db, userId, currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }),
      { merge: true };
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, userId, noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortArr}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
            updateNote={updateNote}
            currentNote={currentNote}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1
            style={{
              fontSize: "60px",
            }}
          >
            You have no notes
          </h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
