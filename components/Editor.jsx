import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import axios from "axios";
import "../editor.css";
export default function Editor({
  tempNoteText,
  setTempNoteText,
  updateNote,
  currentNote,
}) {
  const [selectedTab, setSelectedTab] = React.useState("write");
  const [sendPropmt, setSendPrompt] = React.useState();
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  function changePrompt(event) {
    setSendPrompt(event.target.value);
  }
  async function sendToAgent() {
    const apiUrl =
      "https://axw45fudnatl6qzkd4cgd2pj440uyjhd.lambda-url.us-west-1.on.aws/";

    const data = {
      query: `${sendPropmt}`,
    };
    let answer;
    axios
      .post(apiUrl, data)
      .then((response) => {
        answer = response.data.response;
        updateNote(
          `${currentNote?.body} \n\n 
          ------------------------ \n\n
          Question : ${sendPropmt} \n\n
           Answer : ${answer} `
        );
        console.log("transaction successfull");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="pane editor">
      <textarea
        rows="1"
        cols="60"
        style={{
          marginTop: "30px",
          borderRadius: "5px",
          border: "transparent",
        }}
        placeholder="enter what you need to save in a note  ex :  summarize lesson 1 for physics"
        onChange={changePrompt}
      ></textarea>
      <button
        style={{
          marginLeft: "20px",
          backgroundColor: "black",
          color: "white",
          padding: "5px  20px",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "10px",
        }}
        onClick={sendToAgent}
        className="submit--button"
      >
        submit
      </button>
      <ReactMde
        value={tempNoteText}
        onChange={setTempNoteText}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        minEditorHeight={30}
        heightUnits="vh"
      />
    </section>
  );
}
