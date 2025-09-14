import React, { useState } from "react";
import "./aiLeftBar.css";
import { SwapVert, Upload, UploadOutlined } from "@mui/icons-material";
import SavedItemBtn from "../aiUiKit/savedItemBtn/SavedItemBtn";

export default function AiLeftBar(props) {
  const {
    enabled,
    model,
    setMessages,
    currentDialogId,
    setCurrentDialogId,
    currentDialogName,
    setCurrentDialogName,
    setCurrentDialogMessages,
    setExtendedToLeft,
    dialogueList,
    setDialogueList,
    response,
  } = props;

  const [sortChat, setSortChat] = useState(false);

  const handleDeleteDialog = (dialogId) => {
    if (!dialogId) {
      console.error("Dialog ID is null or undefined");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this dialog?"
    );
    if (!confirmed) {
      console.log("Dialog deletion cancelled");
      return;
    }

    const request = indexedDB.open("AI_Dialogues_DB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("dialogues", "readwrite");
      const store = transaction.objectStore("dialogues");

      const deleteRequest = store.delete(dialogId);

      deleteRequest.onsuccess = () => {
        console.log("Dialog deleted successfully from IndexedDB");

        // Update UI
        setDialogueList((prevList) =>
          prevList.filter((dialog) => dialog.initId !== dialogId)
        );

        if (dialogId === currentDialogId) {
          setCurrentDialogId("");
          setCurrentDialogName("");
          setCurrentDialogMessages([]);
        }
      };

      deleteRequest.onerror = (event) => {
        console.error(
          "Error deleting dialog from IndexedDB:",
          event.target.error
        );
      };
    };

    request.onerror = (event) => {
      console.error("IndexedDB open error:", event.target.error);
    };
  };

  const loadItem = (dialogue) => {
    setMessages(dialogue.messages);
    setCurrentDialogId(dialogue.initId);
    setCurrentDialogName(dialogue.dialogueTitle);
    setCurrentDialogMessages(dialogue.messages);
    setExtendedToLeft(true);
  };
  return (
    <>
      {enabled && !response && (
        <div className="aiLeftBar">
          <div className="aiLeftBarHeader">
            <h3 className="aiLeftBarHeaderTitle">My chats with</h3>
            <h4 className="aiLeftBarHeaderSubtitle">{model}</h4>
          </div>
          <div className="aiLeftBarBody">
            <div className="aiLeftBarBodyModels">
              {dialogueList === null || dialogueList === undefined ? (
                <p className="aiLeftBarBodyModelsItem">No dialogues found</p>
              ) : (
                dialogueList
                  .sort((a, b) =>
                    sortChat
                      ? new Date(a.updatedAt) - new Date(b.updatedAt)
                      : new Date(b.updatedAt) - new Date(a.updatedAt)
                  )
                  .map((item, index) => (
                    <SavedItemBtn
                      key={index}
                      loadItem={loadItem}
                      item={item}
                      itemName={currentDialogName}
                      handleDeleteItem={handleDeleteDialog}
                      {...props}
                    />
                  ))
              )}
            </div>
          </div>
          {dialogueList.length > 0 && (
            <span
              className="aiLeftBarBodyCount"
              onClick={() => setSortChat(!sortChat)}
            >
              {dialogueList?.length}
              <SwapVert
                className=" iconTransformScale"
                style={{ fontSize: "1.5rem" }}
              />
            </span>
          )}
        </div>
      )}

      <label htmlFor="jsonFile" className="aiLeftBarAddBtn">
        <p className="chatAiMessengerHeaderBtnText">Add dialog file</p>
        {/* <RestartAlt className="iconTransformScale" /> */}
        <UploadOutlined className="iconTransformScale" />
        <input
          style={{ display: "none" }}
          type="file"
          id="jsonFile"
          accept=".json"
          // disabled={connection || typing || thinking}
          onChange={(e) => {
            const jsonFile = e.target.files[0];
            if (jsonFile) {
              console.log("---FILE---:",jsonFile);
              console.log("---FILE-NAME---:",jsonFile.name.split(".json")[0]);
              const reader = new FileReader();

              
              reader.readAsText(jsonFile);
              reader.onloadend = () => {
                const json = JSON.parse(reader.result);
                console.log("json ---FILE---:", json);
                setMessages(json);
                setCurrentDialogId("");
                setCurrentDialogName("");
                setCurrentDialogMessages(json);
                setExtendedToLeft(true);
              };
            }
          }}
        />
      </label>
    </>
  );
}
