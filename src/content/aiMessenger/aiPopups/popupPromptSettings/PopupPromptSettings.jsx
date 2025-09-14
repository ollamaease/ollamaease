import React, { useEffect, useRef, useState } from "react";
import "./popupPromptSettings.css";
import Button from "../../aiUiKit/button/Button";
import { Close } from "@mui/icons-material";
import SettingItemThinking from "../popupSettingsAi/SettingItemThinking";

export default function popupPromptSettings(props) {
  const {
    setShowPromptSettings,
    systemicImpurities,
    setSystemicImpurities,
    enableThinkingPrompt,
    setEnableThinkingPrompt,
  } = props;

  const [openKey, setOpenKey] = useState(null);

  const keyRefs = useRef({});

  const toggleKey = (key) => {
    setOpenKey((prevKey) => (prevKey === key ? null : key));
  };

  useEffect(() => {
    if (openKey && keyRefs.current[openKey]) {
      keyRefs.current[openKey].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openKey]);

  const handleClose = () => {
    setShowPromptSettings(false);
  };

  const handleSave = () => {
    window.confirm("Saved!");
  };

  const handleReset = () => {
    window.confirm("Are you sure you want to reset?");
  };

  return (
    <div className="popupPromptSettings">
      <div className="popupPromptSettingsContainer">
        <div className="popupPromptSettingsHeader">
          <h3 className="popupPromptSettingsHeaderTitle">Prompt Settings</h3>
          <Close
            className="popupPromptSettingsHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowPromptSettings(false);
            }}
          />
        </div>
        <div className="popupPromptSettingsBody">
          <div className="popupPromptSettingsBodyPrompt">
            <p className="popupPromptSettingsBodyPromptTitle">
              Actual system prompt
            </p>
            <div className="popupPromptSettingsBodyPromptBlock">
              {systemicImpurities}
            </div>
          </div>
          <label
            className="popupPromptSettingsBodyBlockLabel"
            ref={(el) => {
              if (openKey === "thinkingPrompt")
                keyRefs.current["thinkingPrompt"] = el;
            }}
          >
            <Button
              className="popupPromptSettingsBodyButton"
              name={"Enable thinking prompt"}
              style={{
                cursor: "pointer",
                fontWeight: openKey === "thinkingPrompt" ? "bold" : "normal",
                color:
                  openKey === "thinkingPrompt" ? "var(--green)" : "var(--gray)",
              }}
              onClick={() => toggleKey("thinkingPrompt")}
            />
            {openKey === "thinkingPrompt" && <SettingItemThinking {...props} />}
          </label>
          <label
            className="popupPromptSettingsBodyBlockLabel"
            ref={(el) => {
              if (openKey === "task") keyRefs.current["task"] = el;
            }}
          >
            <Button
              className="popupPromptSettingsBodyButton"
              name={"Assign a task"}
              style={{
                cursor: "pointer",
                fontWeight: openKey === "task" ? "bold" : "normal",
                color: openKey === "task" ? "var(--green)" : "var(--gray)",
              }}
              onClick={() => toggleKey("task")}
            />
            {openKey === "task" && (
              <textarea
                className={"popupPromptSettingsBodyBlockTextarea"}
                placeholder={"Example: 'clear verb: find, analyze, formulate'"}
                // value={assistantRole}
                // onChange={(e) => setAssistantRole(e.target.value)}
              ></textarea>
            )}
          </label>
          <label
            className="popupPromptSettingsBodyBlockLabel"
            ref={(el) => {
              if (openKey === "context") keyRefs.current["context"] = el;
            }}
          >
            <Button
              className="popupPromptSettingsBodyButton"
              name={"Assign a context"}
              style={{
                cursor: "pointer",
                fontWeight: openKey === "context" ? "bold" : "normal",
                color: openKey === "context" ? "var(--green)" : "var(--gray)",
              }}
              onClick={() => toggleKey("context")}
            />
            {openKey === "context" && (
              <textarea
                className={"popupPromptSettingsBodyBlockTextarea"}
                placeholder={"Example: 'What we are looking for is ...'"}
                // value={assistantRole}
                // onChange={(e) => setAssistantRole(e.target.value)}
              ></textarea>
            )}
          </label>
          <label
            className="popupPromptSettingsBodyBlockLabel"
            ref={(el) => {
              if (openKey === "example") keyRefs.current["example"] = el;
            }}
          >
            <Button
              className="popupPromptSettingsBodyButton"
              name={"Assign a example"}
              style={{
                cursor: "pointer",
                fontWeight: openKey === "example" ? "bold" : "normal",
                color: openKey === "example" ? "var(--green)" : "var(--gray)",
              }}
              onClick={() => toggleKey("example")}
            />
            {openKey === "example" && (
              <textarea
                className={"popupPromptSettingsBodyBlockTextarea"}
                placeholder={"Example: 'Use the following example: ...'"}
                // value={assistantRole}
                // onChange={(e) => setAssistantRole(e.target.value)}
              ></textarea>
            )}
          </label>
          <label
            className="popupPromptSettingsBodyBlockLabel"
            ref={(el) => {
              if (openKey === "format") keyRefs.current["format"] = el;
            }}
          >
            <Button
              className="popupPromptSettingsBodyButton"
              name={"Assign a format"}
              style={{
                cursor: "pointer",
                fontWeight: openKey === "format" ? "bold" : "normal",
                color: openKey === "format" ? "var(--green)" : "var(--gray)",
              }}
              onClick={() => toggleKey("format")}
            />
            {openKey === "format" && (
              <textarea
                className={"popupPromptSettingsBodyBlockTextarea"}
                placeholder={"Example: 'Table, text, list, json, etc.'"}
                // value={assistantRole}
                // onChange={(e) => setAssistantRole(e.target.value)}
              ></textarea>
            )}
          </label>
        </div>
        <div className="popupPromptSettingsButtons">
          <Button onClick={handleSave} name="Save" />
          <Button onClick={handleClose} name="Close" />
          <Button onClick={handleReset} name="↩ Reset" />
        </div>
      </div>
    </div>
  );
}
