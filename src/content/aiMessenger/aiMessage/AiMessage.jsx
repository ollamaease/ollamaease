import React, { useEffect, useState } from "react";
import "./aiMessage.css";
import {
  RecordVoiceOverOutlined,
  VolumeOffOutlined,
  VolumeUpOutlined,
  Delete,
} from "@mui/icons-material";
import Equalizer from "../aiUiKit/animation/equalizer/Equalizer";
import { useMemo } from "react";

export default function AiMessage({
  id,
  message,
  own,
  system,
  model,
  reasoning,
  length,
  file,
  voices,
  setVoices,
  selectedVoice,
  setSelectedVoice,
  setShowVoicesChoice,
  speed,
  dateTime,
  dialogModel,
  setShowUser,
  userAvatar,
  setShowAssistant,
  assistantAvatar,
}) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [collapseThinking, setCollapseThinking] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);


  useEffect(() => {
    // console.log("selectedVoice", selectedVoice);
    const handleVoicesChanged = () => {
      const availableVoices = speechSynthesis.getVoices();
      // setVoices(availableVoices);
      // setVoices(availableVoices.filter(voice => voice.lang.includes('en'))); // Filter voices by language (e.g., English)
      // setVoices(availableVoices.filter(voice => voice.lang === 'en-US')); // Filter voices by language (e.g., English)
      // setVoices(availableVoices.filter(voice => voice.name.includes('Google'))); // Filter voices by name (e.g., Google)
      setVoices(
        availableVoices.filter((voice) => voice.name.includes("Microsoft"))
      ); // Filter voices by name (e.g., Google)

      // setVoices(availableVoices.filter(voice => voice.gender === 'male')); // Filter voices by gender (e.g., male)
      // setVoices(availableVoices.filter(voice => voice.gender === 'female')); // Filter voices by gender (e.g., female)
      // Filter voices to include only Ukrainian (uk-UA)
      //   const ukrainianVoices = availableVoices.filter(voice => voice.lang === 'uk-UA');
      //   setVoices(ukrainianVoices);

      //   // Set the first Ukrainian voice as the default (if any are available)
      //   if (ukrainianVoices.length > 0) {
      //     setSelectedVoice(ukrainianVoices[0]);
      //   }
      setSelectedVoice(selectedVoice || availableVoices[0]); // Set the default voice
    };

    // Initial voice load
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    // Load voices immediately (if already loaded)
    handleVoicesChanged();

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [setVoices, setSelectedVoice, selectedVoice]);

  const speak = (textToSpeak) => {
    if (speechSynthesis.speaking) {
      console.log("Already speaking, please wait.");
      return; // Prevent speaking if already speaking
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = selectedVoice;

    // Set the speaking state to true
    setIsSpeaking(true);

    // Handle when speech synthesis ends
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log("Speech has finished.");
    };

    // Handle errors (e.g., if the voice stops unexpectedly)
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error("Speech synthesis error:", event.error);
    };

    // Check if speech synthesis fails immediately
    utterance.onstart = () => {
      console.log("Speech started");
    };

    // If speech synthesis is not started for any reason
    utterance.onboundary = (event) => {
      if (event.name === "word" && !speechSynthesis.speaking) {
        console.error("Speech synthesis stopped unexpectedly");
        setIsSpeaking(false);
      }
    };

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      setIsSpeaking(false);
      console.error("Failed to start speech synthesis:", error);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // Stop the ongoing speech
      setIsSpeaking(false);
    }
  };

  const handleDeleteMessage = (id) => {
    console.log("Delete message", id);
  };

  return (
    <div className={`message ${own ? "own" : ""}`}>
      <div className="messageTop">
        {!own && !system && (
          <img
            className="chatAiMessengerAvatarImg"
            src={assistantAvatar ? assistantAvatar : "icons/avatarAi.png"}
            alt="AI_avatar"
            onClick={() => setShowAssistant(true)}
          />
        )}
        <div className="messageContainer">
          <div className="messageHeader">
            <p className="messageUsername">
              {own ? "You" : system ? null : model || "Assistant"}
            </p>
            {!own && length > 3 && (
              <img
                className="messageHeaderThinkingImg"
                src="icons/thinkingAi.png"
                alt="AI_avatar"
                onClick={() => setCollapseThinking(!collapseThinking)}
              />
            )}
          </div>
          {reasoning === undefined ? null : (
            <>
              {collapseThinking && (
                <fieldset className="messageTextReasonBox">
                  <legend className="chatAiMessengerThinkingLegend">
                    Thinking window
                  </legend>
                  <div className="messageTextReason">{reasoning}</div>
                  <img
                    className="messageHeaderThinkingImgBottom"
                    src="icons/thinkingAi.png"
                    alt="AI_avatar"
                    onClick={() => setCollapseThinking(!collapseThinking)}
                  />
                </fieldset>
              )}
            </>
          )}
          <div className="messageWrapper">
            {!system && (
              <>
                <div className="messageText">
                  {file?.length > 0 && (
                    <div className="AiMessageImg">
                      <img src={`data:image;base64,${file}`} alt="file" />
                    </div>
                  )}
                  {message}
                  <div className="messageTextSettings">
                    <div className="messageTextSettingsItems">
                    {dialogModel && <p className="messageTextSettingsItem">
                      {dialogModel}
                    </p>}
                    <p className="messageTextSettingsItem">
                      Speed: {speed} token/s
                    </p>
                    <p className="messageTextSettingsItem">
                      {dateTime}
                    </p>
                    </div>
                    <Delete
                      className="messageTextSettingsItemDelete"
                      onClick={() => handleDeleteMessage(id)}
                    />
                  </div>
                </div>
                {!own && (
                  <div className="messageSpeaker">
                    {isSpeaking ? (
                      <Equalizer />
                    ) : (
                      <RecordVoiceOverOutlined
                        style={{
                          color: "var(--gray)",
                          fontSize: "1rem",
                        }}
                        onClick={() => setShowVoicesChoice(true)}
                      />
                    )}
                    <hr className="chatAiMessengerOptionsBtnLine" />
                    {isSpeaking ? (
                      <VolumeOffOutlined
                        style={{
                          color: "var(--red)",
                          fontSize: "1rem",
                        }}
                        onClick={stopSpeaking}
                        disabled={!isSpeaking}
                      />
                    ) : (
                      <VolumeUpOutlined
                        style={{
                          color: "var(--gray)",
                          fontSize: "1rem",
                        }}
                        onClick={() => speak(message.props.children)}
                        disabled={isSpeaking}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {own && (
          <div className="avatarUser messageImg" onClick={() => setShowUser(true)}>
            <img
              className="chatAiMessengerAvatarImg"
              src={userAvatar ? userAvatar : "icons/avatarUser.jpg"}
              alt="AI_avatar"
            />
          </div>
        )}
      </div>
      {/* <div className="messageBottom">{format(message.id)}</div> */}
    </div>
  );
}
