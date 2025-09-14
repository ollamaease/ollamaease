import React from "react";
import "./popupSpeakingVoices.css";
import { Close } from "@mui/icons-material";

export default function PopupSpeakingVoices(props) {
  const { setShowVoicesChoice, voices, setSelectedVoice } = props;
  return (
    <div className="popupSpeakingVoices">
      <div className="popupSpeakingVoicesContainer">
        <label className="popupSpeakingVoicesHeader" htmlFor="languageSelect">
          Choose Language:
          <Close
            className="popupSettingsAiHeaderClose iconTransformScale"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowVoicesChoice(false);
            }}
          />
        </label>
        <select
          onChange={(e) => {
            const selectedVoice = voices[e.target.selectedIndex];
            if (selectedVoice !== null && selectedVoice !== undefined) {
              setSelectedVoice(selectedVoice);
              setShowVoicesChoice(false);
            }
          }}
          
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {/* Display voice name and language on separate lines */}
              <div>{voice.name}</div>
              <div>{voice.lang}</div>
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
