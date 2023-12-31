import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import axios from "axios";
import "../editor.css";
import { getDefaultToolbarCommands } from "react-mde";
import { Flex, Text, Button, Theme } from "@radix-ui/themes";

export default function Editor({
  tempNoteText,
  setTempNoteText,
  updateNote,
  currentNote,
  show,
  noteId,
}) {
  // the state for the tabs
  const [selectedTab, setSelectedTab] = React.useState("write");

  // prompt that will be send to the backend
  const [sendPropmt, setSendPrompt] = React.useState();
  //choosing between the cursurs
  const [cursor, setCursor] = React.useState("pointer");

  // setting up the theme
  const [selectedTheme, setSelectedTheme] = React.useState("dark");

  //uploading an image
  const [uploadedImage, setUploadedImage] = React.useState(null);

  // adding state for materials
  const [materials, setMaterials] = React.useState("materialScience");

  const [markdownConfig, setMarkdownConfig] = React.useState({
    tables: true,
    strikethrough: true,
    tasklists: true,
    smoothLivePreview: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    ghCodeBlocks: true,
    ghMentions: true,
    literalMidWordAsterisks: true,
    parseImgDimensions: true,
    encodeEmails: true,
    backslashEscapesHTMLTags: true,
    emoji: true,
    simplifiedAutoLink: true,
    splitAdjacentBlockQuotes: true,
    ghAtxHeaderSpace: true,
    disableForced4SpacesIndentedSublists: true,
  });

  const converter = new Showdown.Converter(markdownConfig);

  function changePrompt(event) {
    setSendPrompt(event.target.value);
  }
  function handleMarkdownConfigChange(option, value) {
    setMarkdownConfig((prevConfig) => ({
      ...prevConfig,
      [option]: value,
    }));
  }

  function handleThemeChange(theme) {
    setSelectedTheme(theme);
  }

  function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    url = URL.createObjectURL(imageFile);
    updateNote(`[](${url})`);
  }

  //setting up the material state
  function handleMaterialChange(event) {
    setMaterials(event.target.value);
  }

  async function sendToAgent() {
    if (sendPropmt !== undefined && materials !== "") {
      const apiUrl =
        materials === "materialScience"
          ? "any url"
          : "http://localhost:8000/stream";

      console.log("the material is ${materials} and the apiURL is ${apiUrl}");
      setCursor((prevCursur) => (prevCursur = "wait"));
      let data;
      if (materials !== "materialScience") {
        data = { question: sendPropmt, session_id: noteId };
      } else {
        data = { query: sendPropmt };
      }
      let answer;
      axios
        .post(apiUrl, JSON.stringify(data))
        .then((response) => {
          answer = response.data.response;
          updateNote(
            `${currentNote?.body}
          ------------------------
          Question : ${sendPropmt}
           Answer : ${answer} `
          );
          setCursor((prevCursur) => (prevCursur = "pointer"));
          console.log("transaction successfull");
        })
        .catch((error) => {
          alert(error);
          setCursor((prevCursur) => (prevCursur = "pointer"));
        });
    } else {
      alert("please fill in the question box");
    }
  }

  return (
    <section className="pane editor" style={{ width: "100vw" }}>
      <div>
        <div className="form-container">
          <div>
            <select
              className={
                window.innerWidth < 400 ? "select--box--mobile" : "select--box"
              }
              onChange={handleMaterialChange}
              value={materials}
            >
              <option value="materialScience">materialScience</option>
              <option value="manufacturing">manufacturing</option>
              <option value="general" selected>
                general
              </option>
            </select>
          </div>

          <input
            type="text"
            placeholder="ask a question to take a note "
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
              width: "60%",
            }}
            className="editor--input--text"
          ></input>

          <Theme accentColor="sky" grayColor="sand" radius="large">
            <Button
              style={{
                marginLeft: "20px",
                padding: "5px  20px",
                margin: "10px",
                cursor: `${cursor}`,
              }}
              onClick={
                cursor === "pointer"
                  ? () => sendToAgent()
                  : () => {
                      console.log("wait");
                    }
              }
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
          classes={{
            preview: selectedTheme, // Apply the selected theme class to the preview
          }}
          disablePreview={false}
        />
      </div>

      {/* <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" />} */}
    </section>
  );
}
