import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db, userId } from "./firebase";
import "./style.css";
import "@radix-ui/themes/styles.css";
import { Flex, Text, Button, Theme } from "@radix-ui/themes";
export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const [show, setShow] = React.useState(true);
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
  function handleShow() {
    setShow((prevShow) => !prevShow);
  }

  return (
    <main
      style={{
        position: "relative",
      }}
    >
      <Theme
        accentColor={show ? "transparent" : "red"}
        grayColor="slate"
        radius="large"
        style={{
          position: "absolute",
          top: "1%",
          left: "0.5%",
        }}
      >
        <Button onClick={handleShow}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 5.25C1.91421 5.25 2.25 4.91421 2.25 4.5C2.25 4.08579 1.91421 3.75 1.5 3.75C1.08579 3.75 0.75 4.08579 0.75 4.5C0.75 4.91421 1.08579 5.25 1.5 5.25ZM4 4.5C4 4.22386 4.22386 4 4.5 4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H4.5ZM2.25 7.5C2.25 7.91421 1.91421 8.25 1.5 8.25C1.08579 8.25 0.75 7.91421 0.75 7.5C0.75 7.08579 1.08579 6.75 1.5 6.75C1.91421 6.75 2.25 7.08579 2.25 7.5ZM1.5 11.25C1.91421 11.25 2.25 10.9142 2.25 10.5C2.25 10.0858 1.91421 9.75 1.5 9.75C1.08579 9.75 0.75 10.0858 0.75 10.5C0.75 10.9142 1.08579 11.25 1.5 11.25Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </Theme>
      {notes.length > 0 ? (
        show ? (
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
            gutterSize={10}
          >
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
              show={show}
            />
          </Split>
        ) : (
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
            updateNote={updateNote}
            currentNote={currentNote}
            show={show}
          />
        )
      ) : (
        <div className="no-notes">
          <h1>TAKE EASY AI NOTES 📜</h1>
          <button className="first-note" onClick={createNewNote}>
            it's free try it out 🚀
          </button>
        </div>
      )}
    </main>
  );
}
