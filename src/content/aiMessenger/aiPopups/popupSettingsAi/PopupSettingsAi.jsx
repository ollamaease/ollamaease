import React, { useEffect, useState } from "react";
import "./popupSettingsAi.css";
import { Close, InfoOutline, MessageOutlined } from "@mui/icons-material";
import Button from "../../aiUiKit/button/Button";
import Input from "../../aiUiKit/input/Input";

import SettingItemThinking from "./SettingItemThinking";

export default function PopupSettingsAi(props) {
  const {
    setShowSettings,
    setShowPromptSettings,
    setShowUser,
    setShowAssistant,
    setShowInfo,
    setShowModelContext,
    showParametersBtn,
    setShowParameters,
    setShowUpdateModel,
    setShowDeleteModel,
    setShowIndexedDB,
    setDownloadModel,
  } = props;

  return (
    <div className="popupSettingsAi">
      <div className="popupSettingsAiContainer">
        <div className="popupSettingsAiHeader">
          <h3 className="popupSettingsAiHeaderTitle">🛠 Setting</h3>
          <Close
            className="popupSettingsAiHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowSettings(false);
            }}
          />
        </div>
        {/* <SettingMenu {...props} /> */}
        <div className="popupSettingsAiBody">
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowUser(true)}
            name={"User"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowAssistant(true)}
            name={"Assistant"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowPromptSettings(true)}
            name={"=Prompt="}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowModelContext(true)}
            name={"Context"}
          />
          {showParametersBtn && (
            <Button
              className="popupSettingsAiBodyButton"
              onClick={() => setShowParameters(true)}
              name={"-Parameters-"}
            />
          )}
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowUpdateModel(true)}
            name={"Update a Model"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowInfo(true)}
            name={"Info"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => {
              setDownloadModel(true);
              setShowUpdateModel(true);
            }}
            name={"Pull a Model"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowDeleteModel(true)}
            name={"Delete a Model"}
          />
          <Button
            className="popupSettingsAiBodyButton"
            onClick={() => setShowIndexedDB(true)}
            name={"Database"}
          />
        </div>
        <div className="popupSettingsAiButtons">
          <Button
            className="popupSettingsAiButton"
            onClick={() => {
              setShowSettings(false);
            }}
            name={"Close"}
          />
          {/* <Button
            className="popupSettingsAiButton"
            onClick={() => {
              setShowSettings(false);
            }}
            name={"Reset"}
          />
          <Button
            className="popupSettingsAiButton"
            onClick={() => {
              setShowSettings(false);
            }}
            name={"Save"}
          /> */}
        </div>
      </div>
    </div>
  );
}
