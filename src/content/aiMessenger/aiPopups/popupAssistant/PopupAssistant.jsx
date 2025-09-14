import React, { useEffect, useRef, useState } from "react";
import "./popupAssistant.css";
import Button from "../../aiUiKit/button/Button";
import Input from "../../aiUiKit/input/Input";
import {
  AddAPhoto,
  Cancel,
  Close,
  LockOpen,
  LockOutline,
} from "@mui/icons-material";

export default function PopupAssistant(props) {
  const {
    setShowAssistant,
    assistantAvatar,
    setAssistantAvatar,
    model,
    assistantRole,
    setAssistantRole,
    assistantTone,
    setAssistantTone,
    assistantDescription,
    setAssistantDescription,
  } = props;

  const [file, setFile] = useState(null);

  const handleCancelPicture = () => {
    setFile(null);
    setAssistantAvatar("");
  };

  // Function to handle file conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Size of file", e.target.files[0].size);
    if (file) {
      const reader = new FileReader();

      // This event is triggered once the file is read
      reader.onloadend = () => {
        setAssistantAvatar(reader.result); // The Base64 string will be in reader.result
      };

      // Read the file as a Data URL (Base64)
      reader.readAsDataURL(file);
    }
  };

  // console.log("Profile image", assistantAvatar.split(",")[1]);

  const handleClose = () => {
    setShowAssistant(false);
  };

  const handleSave = () => {
    const customAssistant = {
      picture: assistantAvatar ? assistantAvatar : null,
      assistantModel: model,
      assistantRole: assistantRole ? assistantRole : null,
      assistantTone: assistantTone ? assistantTone : null,
      assistantDescription: assistantDescription ? assistantDescription : null,
    };
    if (model && customAssistant) {
      chrome.storage.local.set({ [`custom_assistant_${model}`]: customAssistant }, () => {
        console.log("Custom assistant saved", customAssistant);
      });
    } else {
      console.error("Model or custom assistant is null or undefined");
    }
    setShowAssistant(false);
    // window.confirm("Saved!");
  };

  const handleReset = () => {
    chrome.storage.local.set({ [`custom_assistant_${model}`] : null });
    setAssistantAvatar(null);
    setAssistantRole("");
    setAssistantTone("");
    setAssistantDescription("");
  };

  return (
    <div className="popupAssistant">
      <div className="popupAssistantContainer">
        <div className="popupAssistantHeader">
          <h3 className="popupAssistantHeaderTitle">Assistant Settings</h3>
          <Close
            className="popupAssistantHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowAssistant(false);
            }}
          />
        </div>
        <div className="popupAssistantBody">
          <div className="popupAssistantBodyBlock">
            <div className="popupAssistantBodyBlockPicture">
              <img
                className="popupAssistantBodyBlockAvatarImg"
                src={
                  assistantAvatar
                    ? assistantAvatar
                    : assistantAvatar
                    ? `data:image;base64,${assistantAvatar}`
                    : "icons/avatarAi.png"
                }
                alt="AI_avatar"
              />
              {(assistantAvatar || assistantAvatar) && (
                <Cancel
                  className="popupAssistantBodyBlockAddPhotoCancel"
                  style={{ color: "var(--bg)" }}
                  onClick={handleCancelPicture}
                />
              )}
              <label htmlFor="file" className="popupAssistantBodyBlockAddPhoto">
                <AddAPhoto className="popupAssistantBodyBlockAddPhotoIcon iconTransformScale" />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFile(file);
                      handleFileChange(e);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <p className="popupAssistantBodyBlockTitle">{model}</p>

         
          <label className="popupAssistantBodyBlockLabel">
            <p className="popupAssistantBodyBlockTitle">Assign a role</p>
            <textarea
              className={"popupAssistantBodyBlockTextarea"}
              placeholder={
                "Example: 'You are the head of a creative department for a leading advertising agency …'\n(c)gemini-for-google-workspace-prompting-guide-101.pdf (p. 67)"
              }
              value={assistantRole}
              onChange={(e) => setAssistantRole(e.target.value)}
            ></textarea>
          </label>
         
          <label className="popupAssistantBodyBlockLabel">
            <p className="popupAssistantBodyBlockTitle">Consider tone</p>
            <select
              className="select"
              value={assistantTone}
              onChange={(e) => setAssistantTone(e.target.value)}
            >
              <option value="">Ask for outputs to have a specific tone</option>
              <option value="formal">formal</option>
              <option value="informal">informal</option>
              <option value="casual">casual</option>
              <option value="creative">creative</option>
              <option value="technical">technical</option>
            </select>
        
          </label>
          {/* <label className="popupAssistantBodyBlockLabel">
            <p className="popupAssistantBodyBlockTitle">Describe assistant</p>
            <textarea
              className={"popupAssistantBodyBlockTextarea"}
              placeholder={
                "Write something about yourself to make it easier for the AI to understand who it is communicating with. If necessary or you want..."
              }
              value={assistantDescription}
              onChange={(e) => setAssistantDescription(e.target.value)}
            ></textarea>
          </label> */}
        </div>
        <div className="popupAssistantButtons">
          <Button onClick={handleSave} name="Save" />
          <Button onClick={handleClose} name="Close" />
          <Button onClick={handleReset} name="↩ Reset" />
        </div>
      </div>
    </div>
  );
}
