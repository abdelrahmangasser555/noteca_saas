import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import axios from "axios";
import "../editor.css";
import { Flex, Text, Button, Theme } from "@radix-ui/themes";

export default function Editor({
  tempNoteText,
  setTempNoteText,
  updateNote,
  currentNote,
  show,
}) {
  const [selectedTab, setSelectedTab] = React.useState("write");
  const [sendPropmt, setSendPrompt] = React.useState();

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    parseImgDimensions: true,
    smoothLivePreview: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    ghCodeBlocks: true,
    ghMentions: true,
    literalMidWordAsterisks: true,
    parseImgDimensions: true, // Repeated (you can remove this line)
    encodeEmails: true,
    backslashEscapesHTMLTags: true,
    emoji: true,
    simplifiedAutoLink: true, // Repeated (you can remove this line)
    splitAdjacentBlockQuotes: true,
    ghAtxHeaderSpace: true,
    disableForced4SpacesIndentedSublists: true,
  });

  const [cursor, setCursor] = React.useState("pointer");

  function changePrompt(event) {
    setSendPrompt(event.target.value);
  }
  async function sendToAgent() {
    if (sendPropmt !== undefined) {
      const apiUrl =
        "https://axw45fudnatl6qzkd4cgd2pj440uyjhd.lambda-url.us-west-1.on.aws/";
      setCursor((prevCursur) => (prevCursur = "wait"));
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
          setCursor((prevCursur) => (prevCursur = "pointer"));
          console.log("transaction successfull");
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert("please fill in the question box");
    }
  }

  return (
    <section className="pane editor" style={{ width: "100%" }}>
      <div className="form-container">
        <input
          type="text"
          placeholder="ask somthing"
          onChange={changePrompt}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendToAgent();
            }
          }}
          style={{
            minHeight: "30px",
            flex: "1",
            resize: "vertical",
            overflowY: "auto",
            borderRadius: "10px",
            border: "solid 1px grey",
          }}
          className="editor--input--text"
        ></input>
        <Theme accentColor="sky" grayColor="sand" radius="large">
          <Button
            style={{
              marginLeft: "20px",
              padding: "5px  20px",
              cursor: "pointer",
              margin: "10px",
              cursor: `${cursor}`,
            }}
            onClick={sendToAgent}
            className="submit--button"
          >
            {cursor === "wait" ? "loading ..." : "submit"}
          </Button>
        </Theme>
      </div>
      <ReactMde
        value={tempNoteText}
        onChange={setTempNoteText}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        minEditorHeight={60}
        heightUnits="vh"
      />
    </section>
  );
}
