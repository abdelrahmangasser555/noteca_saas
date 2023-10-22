import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import axios from "axios";
export default function Editor({ currentNote, updateNote }) {
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
  function sendToTelegram() {
    const apiUrl =
      "https://api.telegram.org/bot6387137843:AAGvPvHq2ESUujV7Vd3NEkWTnQ5zZ_wBJkc/sendMessage"; // Replace YOUR_BOT_TOKEN with your actual bot token

    const data = {
      chat_id: "5591930127",
      text: { sendPropmt },
    };

    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log(response.status());
      })
      .catch((error) => {
        console.error("Error:", error);
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
        placeholder="enter what you need to save in a note ex"
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
        onClick={sendToTelegram}
      >
        submit
      </button>
      <ReactMde
        value={currentNote.body}
        onChange={updateNote}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        minEditorHeight={80}
        heightUnits="vh"
      />
    </section>
  );
}
