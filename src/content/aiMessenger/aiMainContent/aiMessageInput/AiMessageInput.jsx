import React, { useState } from "react";
import "./aiMessageInput.css";
import {
  SendOutlined,
  AttachFile,
  Cancel,
  Mic,
  Add,
  MicOffOutlined,
  DoDisturbOutlined,
  SpeakerNotesOff,
} from "@mui/icons-material";
import Equalizer from "../../aiUiKit/animation/equalizer/Equalizer";
import PopupSpeechRecognitionLang from "../../aiPopups/popupSpeechRecognitionLang/PopupSpeechRecognitionLang";

export default function AiMessageInput(props) {
  const {
    enabled,
    sendMessage,
    file,
    setFile,
    newMessage,
    setNewMessage,
    multimodalModel,
    startOrContinueDialog,
    setFileBase64,
    typing,
    thinking,
    connection,
    response,
    interruptAssistant,
    tokenCount,
    setTokenCount,
    totalContext,
    setStopStream,
    userContext,
    setUserContext,
    multimodalModelVision,
    setMultimodalModelVision,
    multimodalModelTools,
    setMultimodalModelTools,
  } = props;

  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Default language is English
  const [showSpeechLanguage, setShowSpeechLanguage] = useState(false);

  // Function to handle file conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      // This event is triggered once the file is read
      reader.onloadend = () => {
        setFileBase64(reader.result); // The Base64 string will be in reader.result
      };

      // Read the file as a Data URL (Base64)
      reader.readAsDataURL(file);
    }
  };

  // Initialize Speech Recognition API
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();

  recognition.lang = language;

  // When speech recognition starts
  recognition.onstart = () => {
    setIsListening(true);
  };

  // When speech recognition gets a result
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setNewMessage(result);
  };

  // When speech recognition ends
  recognition.onend = () => {
    setIsListening(false);
  };

  // Handle button click to start voice recognition
  const handleStartButtonClick = () => {
    recognition.start();
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    recognition.lang = event.target.value; // Update the recognition language
    setShowSpeechLanguage(false);
  };

  const handleCancelPicture = () => {
    setFile(null);
    setNewMessage(""); // Clear the input field
    setTokenCount(0);
  };

  const approximateTokenCount = (input) => {
    let count = Math.ceil(input?.trim().split(/\s+/).length * 1.3);
    const token = count;
    // console.log("token66667777", token);
    setTokenCount(count);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setUserContext(Number(userContext) + Number(tokenCount));
      setStopStream(false);
      sendMessage();
    }
  };

  return (
    <>
      {showSpeechLanguage && (
        <PopupSpeechRecognitionLang
          {...{
            setShowSpeechLanguage,
            language,
            handleLanguageChange,
          }}
        />
      )}
      {enabled && !response && (
        <div
          className="chatAiMessengerBottom"
        >
          {multimodalModel && (
            <div
              className="chatAiMessengerOptionsBtn"
              style={
                connection || typing || thinking
                  ? { backgroundColor: "var(--bordersOpacity)" }
                  : file
                  ? { backgroundColor: "var(--bg)", width: "90px" }
                  : { backgroundColor: "var(--bg)" }
              }
            >
              {file ? (
                <div className="chatAiMessengerImgPreview">
                  <img
                    className="chatAiMessengerImage"
                    src={URL.createObjectURL(file)}
                    alt="message_img"
                  />
                  <Cancel
                    className="shareCancel"
                    style={{ color: "var(--gray)" }}
                    onClick={handleCancelPicture}
                  />
                </div>
              ) : (
                <>
                  {connection || typing || thinking ? (
                    <DoDisturbOutlined />
                  ) : (
                    <>
                      {multimodalModelVision && (
                        <label
                          htmlFor="file"
                          className="chatAiMessengerInputLabels"
                        >
                          <AttachFile
                            className="iconTransformScale"
                          />
                          <input
                            style={{ display: "none" }}
                            type="file"
                            id="file"
                            accept=".png, .jpeg, .jpg"
                            disabled={connection || typing || thinking}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setFile(file);
                                handleFileChange(e);
                                setTimeout(() => {
                                  setNewMessage("What is in this picture?");
                                  setTokenCount(totalContext + 6);
                                }, 100);
                              }
                            }}
                          />
                        </label>
                      )}
                      {multimodalModelTools && (
                        <>
                          {multimodalModelVision && (
                            <hr className="chatAiMessengerOptionsBtnLine" />
                          )}
                          <Add className="iconTransformScale" />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
          <div
            className="chatAiMessengerOptionsBtn"
            style={
              isListening
                ? {
                    backgroundColor: "var(--greenOpacityBg)",
                    borderColor: "var(--green)",
                  }
                : connection || typing || thinking
                ? { backgroundColor: "var(--bordersOpacity)" }
                : { backgroundColor: "var(--bg)" }
            }
          >
            {isListening ? (
              <Equalizer />
            ) : (
              <>
                {connection || typing || thinking ? (
                  <MicOffOutlined />
                ) : (
                  <>
                    <Mic
                      className="iconTransformScale"
                      onClick={handleStartButtonClick}
                    />
                    <hr className="chatAiMessengerOptionsBtnLine" />
                    <p
                      className="textTransformScale"
                      onClick={() => setShowSpeechLanguage(true)}
                    >
                      {language.split("-")[1]}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
          {/* <Dots /> */}
          <textarea
            id="chatAiMessengerInput"
            className="chatAiMessengerInput"
            placeholder={"Write something..."}
            onChange={(e) => {
              setNewMessage(e.target.value);
              approximateTokenCount(e.target.value);
            }}
            value={
              connection || typing || thinking
                ? "wait a minute the model is responding..."
                : newMessage
            }
            onKeyDown={handleKeyDown}
            required={true}
            autoFocus={true}
            disabled={connection || typing || thinking}
            style={
              connection || typing || thinking
                ? {
                    backgroundColor: "var(--bordersOpacity)",
                    textAlign: "center",
                    color: "var(--gray)",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }
                : { backgroundColor: "var(--bg)" }
            }
          ></textarea>
          <div
            className="chatAiMessengerOptionsBtn"
            style={
              connection || typing || thinking
                ? { backgroundColor: "var(--bordersOpacity)" }
                : { backgroundColor: "var(--bg)" }
            }
            onClick={() => {
              startOrContinueDialog();
              // approximateTokenCount(newMessage);
            }}
          >
            {/* <button
              className="chatAiMessengerSubmitButton"
              disabled={connection || typing || thinking}
            > */}
            {connection || typing || thinking ? (
              // <ScheduleSendOutlined style={{ fontSize: "1.5rem" }} />
              <div className="messageTextPreloaderInterrupt">
                <SpeakerNotesOff
                  style={{
                    color: "var(--gray)",
                    fontSize: "1rem",
                  }}
                  // className="iconTransformScale"
                  onClick={interruptAssistant}
                />
              </div>
            ) : (
              <SendOutlined style={{ fontSize: "1.5rem" }} />
            )}
            {/* </button> */}
          </div>
        </div>
      )}
    </>
  );
}
