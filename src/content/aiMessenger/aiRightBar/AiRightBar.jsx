import React, { use, useEffect, useMemo, useState } from "react";
import "./aiRightBar.css";
import { Close } from "@mui/icons-material";

export default function AiRightBar(props) {
  const {
    enabled,
    setNewMessage,
    modelList,
    model,
    setShowChangeChat,
    setChangeChatModel,
    setChangeChatDialog,
    activeIndex,
    setActiveIndex,
    setExtendedToRight,
    response,
    setShowIndexedDB,
  } = props;

  const [dialogueList, setDialogueList] = useState([]);
  const [dialogueListFiltered, setDialogueListFiltered] = useState([]);

  const arr = [];

  useMemo(() => {
    if (!model) {
      return;
    }

    const getAllDialoguesFromIndexedDB = () => {
      const request = indexedDB.open("AI_Dialogues_DB", 1);

      // request.onupgradeneeded = (event) => {
      //   const db = event.target.result;
      //   if (!db.objectStoreNames.contains("dialogues")) {
      //     db.createObjectStore("dialogues", { keyPath: "initId" });
      //   }
      // };

      request.onsuccess = (event) => {
        const db = event.target.result;
        try {
          if (!db.objectStoreNames.contains("dialogues")) {
            indexedDB.deleteDatabase("AI_Dialogues_DB");
            console.log("Database deleted 2.");
            return;
          }
        } catch (error) {
          console.error(
            "An error occurred while accessing or modifying the database:",
            error
          );
        }
        const transaction = db.transaction("dialogues", "readonly");
        const store = transaction.objectStore("dialogues");

        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          const allDialogues = getAllRequest.result;

          setDialogueList(allDialogues);
          // console.log("1 Reloaded dialogues from IndexedDB:", allDialogues);
        };

        getAllRequest.onerror = () => {
          console.error("Failed to get dialogues from IndexedDB");
        };
      };

      request.onerror = (event) => {
        console.error("IndexedDB open error:", event.target.error);
      };
    };
    getAllDialoguesFromIndexedDB();
  }, [model]);

  // useEffect(() => {
  //   console.log("dialogueList", dialogueList);
  // }, [dialogueList]);

  const getModelDialoguesFromIndexedDB = (item) => {
    if (!item) {
      console.error("Model not set");
      return;
    }

    const formattedModel = item.name.replace(/\//g, "+");
    console.log("formattedModel", formattedModel);
    const request = indexedDB.open("AI_Dialogues_DB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("dialogues", "readonly");
      const store = transaction.objectStore("dialogues");

      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        const allDialogues = getAllRequest.result;

        // setDialogueList(allDialogues);
        // console.log("1 Reloaded dialogues from IndexedDB:", allDialogues);

        // Filter by selected model name
        const filteredDialogues = allDialogues.filter(
          (dialogue) => dialogue.modelName === formattedModel
        );

        setDialogueListFiltered(filteredDialogues);
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

  const loadItem = (item, index) => {
    getModelDialoguesFromIndexedDB(item);
    handleToggleList(index);
  };

  // useEffect(() => {
  //   console.log("dialogueList", dialogueList);
  //   console.log("dialogueListFiltered", dialogueListFiltered);
  //   console.log("activeIndex", activeIndex);
  //   console.log("arr", arr);
  // }, [dialogueList, dialogueListFiltered, activeIndex, arr]);

  const handleToggleList = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleChangeChat = (model, dialogue) => {
    console.log("handleChangeChat", model, dialogue);
    setShowChangeChat(true);
    setChangeChatModel(model);
    setChangeChatDialog(dialogue);
    setExtendedToRight(true);
  };

  // useEffect(() => {
  //   modelList.forEach((element) => {
  //     const name = element.name.replace(/\//g, "+");
  //     const dialogCount = dialogueList.filter(
  //       (dialog) => dialog.modelName === name
  //     ).length;
  //     arr.push({ name, dialogCount });
  //   });
  // }, [modelList, dialogueList, arr]);

  return (
    <>
      {enabled && !response && (
        <div className="aiRightBarContainer">
          <div className="aiRightBarContainerHeader">
            <h3 className="aiRightBarContainerHeaderTitle">Storage</h3>
          </div>
          <div className="aiRightBarContainerBody">
            {Array.isArray(modelList) &&
              modelList.length > 0 &&
              modelList
                .map((element) => element.name)
                .forEach((name) => {
                  if (dialogueList !== null && dialogueList !== undefined) {
                    arr.push({
                      name: name.replace(/\//g, "+"),
                      dialogCount: dialogueList.filter(
                        (dialog) =>
                          dialog.modelName === name.replace(/\//g, "+")
                      ).length,
                    });
                  } else {
                    console.error("dialogueList is null or undefined");
                  }
                })}
            {modelList.map((item, index) => (
              <>
                <div className="aiRightBarModel" key={index}>
                  <p
                    className="aiRightBarName"
                    style={
                      item?.name === model
                        ? { backgroundColor: "var(--main)" }
                        : {}
                    }
                  >
                    {item.details.family}
                  </p>
                  <p
                    className={`aiRightBarNameCount ${
                      arr[index].dialogCount !== 0 ? "" : "hidden"
                    }`}
                    style={
                      item?.name === model
                        ? { backgroundColor: "var(--borders)" }
                        : {}
                    }
                  >
                    {/* {item.details.family} */}
                    {/* {item.details.parameter_size} */}
                    {arr[index] &&
                      arr[index].dialogCount !== 0 &&
                      `${arr[index].dialogCount}`}
                  </p>
                  <div
                    className="aiRightBarWrapper"
                    onClick={() => loadItem(item, index)}
                  >
                    <p
                      className="aiRightBarModelTitle"
                      style={
                        item?.name === model
                          ? { color: "var(--main)" }
                          : { color: "var(--green)" }
                        //    ??
                        //  ( (activeIndex === index && dialogueListFiltered.length > 0) ? { paddingBottom: "10px" }:{})
                      }
                    >
                      {item.name}
                      {/* <span>{item.messages?.length - 1}</span> */}
                    </p>
                  </div>
                  {activeIndex === index && (
                    <>
                      {dialogueListFiltered?.map((dialogue, index) => (
                        <div className="aiRightBarItem" key={index}>
                          <p className="aiRightBarItemDate">
                            {dialogue.updatedAt?.split("T")[0]}
                          </p>
                          <div
                            className="aiRightBarItemWrapper"
                            onClick={() =>
                              handleChangeChat(item.name, dialogue)
                            }
                          >
                            <p className="aiRightBarItemTitle">
                              {dialogue.dialogueTitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
          {dialogueListFiltered.length > 0 && activeIndex !== null && (
            <span className="aiRightBarLeftContainerBodyCount">
              <Close
                onClick={() => {
                  // setDialogueList([]);
                  setActiveIndex(null);
                }}
              />
            </span>
          )}
        </div>
      )}
      <label
        className="aiLeftBarAddBtn"
        onClick={() => {
          setExtendedToRight(true);
          setShowIndexedDB(true);
        }}
      >
        <p className="chatAiMessengerHeaderBtnText">Open IndexedDB</p>
      </label>
    </>
  );
}
