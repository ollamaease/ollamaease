import React from "react";
import "./popupSpeechRecognitionLang.css";
import { Close } from "@mui/icons-material";

export default function PopupSpeechRecognitionLang(props) {
  const { setShowSpeechLanguage, language, handleLanguageChange } = props;
  return (
    <div className="popupSpeechRecognitionLang">
      <div className="popupSpeechRecognitionLangContainer">
        <label
          className="popupSpeechRecognitionLangHeader"
          htmlFor="languageSelect"
        >
          Choose Language:
          <Close
            className="popupSettingsAiHeaderClose iconTransformScale"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowSpeechLanguage(false);
            }}
          />
        </label>
        <select
          id="languageSelect"
          className="select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en-US">English</option>
          <option value="pl-PL">Polish</option>
          <option value="uk-UA">Ukrainian</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
          <option value="de-DE">German</option>
        </select>
      </div>
    </div>
  );
}
