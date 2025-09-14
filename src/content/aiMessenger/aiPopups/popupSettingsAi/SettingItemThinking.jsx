import React, { useEffect, useState } from "react";
import "./popupSettingsAi.css";
import Input from "../../aiUiKit/input/Input";
import { Close, MessageOutlined } from "@mui/icons-material";

export default function SettingItemThinking(props) {
  const {
    enableThinkingPrompt,
    setEnableThinkingPrompt,
  } = props;

  const [systemRole, setSystemRole] = useState("");
  const [inputSystemRole, setInputSystemRole] = useState("");
  const [systemContent, setSystemContent] = useState("");
  const [anotherRole, setAnotherRole] = useState(false);
  const [anotherContent, setAnotherContent] = useState(false);
  const [toggleThinkingPrompt, setToggleThinkingPrompt] = useState(false);

  useEffect(() => {
    if (systemRole === "another") {
      setAnotherRole(true);
    } else {
      setAnotherRole(false);
    }

    if (systemContent === "another") {
      setAnotherContent(true);
    } else {
      setAnotherContent(false);
    }
    console.log("systemRole", systemRole);
    console.log("inputSystemRole", inputSystemRole);
    console.log("systemContent", systemContent);
    console.log("enableThinkingPrompt", enableThinkingPrompt);
  }, [systemRole, inputSystemRole, systemContent, enableThinkingPrompt]);

  function handleEnableThinkingPrompt() {
    setEnableThinkingPrompt({ role: systemRole, content: systemContent });
    setToggleThinkingPrompt(!toggleThinkingPrompt);
  }

  return (
    <>
      {toggleThinkingPrompt ? (
        <>
          <div className="popupSettingsAiBox">
            <p className="popupSettingsAiBodyInputSubTitle">
              {JSON.stringify(enableThinkingPrompt)}{" "}
            </p>
            <Close
              className="popupSettingsAiHeaderClose"
              style={{ fontSize: "2rem", color: "var(--bg)" }}
              onClick={() => {
                {
                  setToggleThinkingPrompt(false);
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          {!anotherRole && (
            <div className="popupSettingsAiBox">
              <p className="popupSettingsAiBodyInputSubTitle">role:</p>
              <select
                className="select"
                value={systemRole}
                onChange={(e) => setSystemRole(e.target.value)}
              >
                <option value="undefined">choose or input another role</option>
                <option value="system">system</option>
                <option value="control">control</option>
                <option value="another">input another</option>
              </select>
            </div>
          )}

          {anotherRole && (
            <div className="popupSettingsAiBox">
              <p className="popupSettingsAiBodyInputSubTitle">role: </p>
              <Close
                className="popupSettingsAiHeaderClose"
                style={{ fontSize: "2rem", color: "var(--bg)" }}
                onClick={() => {
                  {
                    setAnotherRole(false);
                    setSystemRole("");
                  }
                }}
              />
              <Input
                className="popupSettingsAiBodyInput"
                type="search"
                placeholder="system, control, assistant, user"
                onChangeR={(e) => setInputSystemRole(e.target.value)}
              />
            </div>
          )}
          {!anotherContent && (
            <div className="popupSettingsAiBox">
              <p className="popupSettingsAiBodyInputSubTitle">content:</p>
              <select
                className="select"
                value={systemContent}
                onChange={(e) => setSystemContent(e.target.value)}
              >
                <option value="undefined">
                  choose or input another content
                </option>
                <option value="Enable deep thinking subroutine.">
                  Enable deep thinking subroutine
                </option>
                <option value="thinking">thinking</option>
                <option value="another">input another</option>
              </select>
            </div>
          )}
          {anotherContent && (
            <div className="popupSettingsAiBox">
              <p className="popupSettingsAiBodyInputSubTitle">content: </p>
              <Close
                className="popupSettingsAiHeaderClose"
                style={{ fontSize: "2rem", color: "var(--bg)" }}
                onClick={() => {
                  {
                    setAnotherContent(false);
                    setSystemContent("");
                  }
                }}
                />
              <textarea
                className="popupSettingsAiBodyTextareaSystem"
                placeholder={
                  systemContent ||
                  "Enable deep thinking subroutine. or thinking"
                }
                defaultValue={systemContent}
                value={systemContent}
                onChange={(e) => setSystemContent(e.target.value)}
              ></textarea>
            </div>
          )}
          {systemContent && (systemRole !== "undefined" || inputSystemRole) && (
            <div
              className="chatAiMessengerHeaderBtn popupSettingsAiMenuBtn"
              onClick={() => {
                handleEnableThinkingPrompt();
              }}
            >
              <p className="chatAiMessengerHeaderBtnText">Activate</p>
              <MessageOutlined className="iconTransformScale" />
            </div>
          )}
        </>
      )}
    </>
  );
}
