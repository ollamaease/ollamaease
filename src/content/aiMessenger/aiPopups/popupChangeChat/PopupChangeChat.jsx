import React from "react";
import "./popupChangeChat.css";
import Button from "../../aiUiKit/button/Button";
import { Close } from "@mui/icons-material";

export default function PopupChangeChat(props) {
  const {
    model,
    setShowChangeChat,
    changeChatModel,
    changeChatDialog,
    setMessages,
    setCurrentDialogId,
    setCurrentDialogName,
    setCurrentDialogMessages,
    changeModel,
    chooseModel,
  } = props;

  const handleLoadChat = async (dialogue) => {
    if (model === changeChatModel) {
      setMessages(dialogue.messages);
      setCurrentDialogId(dialogue.initId);
      setCurrentDialogName(dialogue.dialogueTitle);
      setCurrentDialogMessages(dialogue.messages);
      setShowChangeChat(false);
    } else {
      await changeModel(model)
      .then(() => chooseModel(changeChatModel))
      .then(() => {
        if (dialogue && dialogue.messages && dialogue.initId && dialogue.dialogueTitle) {
          setMessages(dialogue.messages);
          setCurrentDialogId(dialogue.initId);
          setCurrentDialogName(dialogue.dialogueTitle);
          setCurrentDialogMessages(dialogue.messages);
          setShowChangeChat(false);
        } else {
          console.error("Error loading dialogue:", dialogue);
        }
      })
      .catch((error) => {
        console.error("Error changing model and loading dialogue:", error);
      });
    }
  };
  return (
    <div className="popupChangeChat">
      <div className="popupChangeChatContainer">
        <div className="popupUpdateModelHeader">
          <h3 className="popupUpdateModelHeaderTitle">
            Change dialog {model === changeChatModel ? "" : "and model"}
          </h3>
          <Close
            className="popupUpdateModelHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowChangeChat(false);
            }}
          />
        </div>
        <div className="popupChangeChatBody">
          <p className="popupChangeChatBodyText">
            Are you sure you want change actual dialog{" "}
            {model === changeChatModel ? "" : "and model"}
            <span>without saving</span> ?
          </p>
          <p className="popupChangeChatBodyText">You chose</p>
          <p className="popupChangeChatBodyText">
            Loading model: <b>{changeChatModel}</b>
          </p>
          <p className="popupChangeChatBodyText">
            Loading dialog name: <b>{changeChatDialog.dialogueTitle}</b>
          </p>
        </div>
        <div className="popupUpdateModelButtons">
          <Button
            className="popupUpdateModelButton"
            onClick={() => {
              setShowChangeChat(false);
            }}
            name={"Cancel"}
          />
          <Button
            className="popupUpdateModelButton"
            onClick={() => {
              handleLoadChat(changeChatDialog);
            }}
            name={"Change"}
          />
        </div>
      </div>
    </div>
  );
}
