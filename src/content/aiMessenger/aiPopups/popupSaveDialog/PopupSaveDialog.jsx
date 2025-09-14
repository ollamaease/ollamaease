import React from "react";
import "./popupSaveDialog.css";
import Button from "../../aiUiKit/button/Button";
import Input from "../../aiUiKit/input/Input";
import { Close } from "@mui/icons-material";

export default function PopupSaveDialog(props) {
  const {
    setSaveDialog,
    model,
    messages,
    currentDialogName,
    setCurrentDialogName,
    setFileBase64,
    setInitId,
    setDialogName,
    setDialogueList,
  } = props;

  //! Save dialog
  const saveDialogue = async () => {
    if (!model || !currentDialogName || !messages) {
      console.error("Missing required data to save dialogue");
      return;
    }

    const initialIdentifier = new Date().getTime().toString();
    setFileBase64("");

    const dialog = {
      modelName: model?.replace(/\//g, "+"),
      initId: initialIdentifier,
      dialogueTitle: currentDialogName,
      messages: messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to IndexedDB
    const saveToIndexedDB = (dialog) => {
      const request = indexedDB.open("AI_Dialogues_DB", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("dialogues")) {
          db.createObjectStore("dialogues", { keyPath: "initId" });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("dialogues", "readwrite");
        const store = transaction.objectStore("dialogues");
        store.put(dialog);
        console.log("Dialogue saved to IndexedDB:", dialog);
      };

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
      };
    };

    const getAllDialoguesFromIndexedDB = () => {
      if (!model) {
        console.error("Model not set");
        return;
      }

      const formattedModel = model.replace(/\//g, "+");
      const request = indexedDB.open("AI_Dialogues_DB", 1);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("dialogues", "readonly");
        const store = transaction.objectStore("dialogues");

        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          const allDialogues = getAllRequest.result;

          // Filter by selected model name
          const filteredDialogues = allDialogues.filter(
            (dialogue) => dialogue.modelName === formattedModel
          );

          setDialogueList(filteredDialogues);
          console.log(
            "Reloaded dialogues from IndexedDB (filtered):",
            filteredDialogues
          );
        };

        getAllRequest.onerror = () => {
          console.error("Failed to get dialogues from IndexedDB");
        };
      };

      request.onerror = (event) => {
        console.error("IndexedDB open error:", event.target.error);
      };
    };

    try {
      setInitId(initialIdentifier);
      saveToIndexedDB(dialog);
    } catch (error) {
      setError(error);
      console.error("Error saving dialogue:", error);
    } finally {
      setSaveDialog(false);
      setCurrentDialogName("");
      setDialogName(currentDialogName);
      getAllDialoguesFromIndexedDB(); // Load updated list
    }
  };

  return (
    <div className="popupSaveDialog">
      <div className="popupSaveDialogContainer">
        <div className="popupUpdateModelHeader">
          <h3 className="popupUpdateModelHeaderTitle">Save dialog</h3>
          <Close
            className="popupUpdateModelHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setSaveDialog(false);
            }}
          />
        </div>
        <div className="popupSaveDialogBody">
          <div className="popupSaveDialogBodyText">
            Are you sure you want to save the dialog?
          </div>
          <Input
            className="popupSaveDialogBodyInput"
            onChangeR={(e) => {
              setCurrentDialogName(e.target.value);
            }}
            value={currentDialogName}
            placeholder="Dialog name"
          />
        </div>
        <div className="popupUpdateModelButtons">
          <Button
            className="popupUpdateModelButton"
            onClick={() => {
              setSaveDialog(false);
              saveDialogue();
            }}
            name={"Save"}
          />
          <Button
            className="popupUpdateModelButton"
            onClick={() => {
              setSaveDialog(false);
              setCurrentDialogName("");
            }}
            name={"Cancel"}
          />
        </div>
      </div>
    </div>
  );
}
