import React, { useEffect, useState } from "react";
import "./aiChatHeader.css";
import {
  SaveOutlined,
  RestartAlt,
  EditNote,
  WavingHandOutlined,
  SettingsOutlined,
  Eject,
  InfoOutline,
  DownloadOutlined,
  SickOutlined,
  HelpOutline,
  QuestionMark,
} from "@mui/icons-material";
import Button from "../../aiUiKit/button/Button";
import { ContentPaste, ContentCopy, Cached } from "@mui/icons-material";
import PopupChangeChat from "../../aiPopups/popupChangeChat/PopupChangeChat";
import PopupUpdateModel from "../../aiPopups/popupUpdateModel/PopupUpdateModel";

export default function AiChatHeader(props) {
  const {
    user,
    startOrContinueDialog,
    dialogueList,
    setDialogueList,
    modelList,
    model,
    setModel,
    enabled,
    setEnabled,
    messages,
    setMessages,
    setNewMessage,
    currentDialogId,
    setCurrentDialogId,
    currentDialogName,
    setCurrentDialogName,
    dialogName,
    setDialogName,
    setCurrentDialogMessages,
    setError,
    setTyping,
    setThinking,
    setConnection,
    setFileBase64,
    setExtendedToRight,
    setStopStream,
    setStreamError,
    setAssistantContext,
    setUserContext,
    totalContext,
    setTotalContext,
    setMultimodalModel,
    controllerRef,
    setShowSettings,
    setSaveDialog,
    setModelBasename,
    setModelSize,
    error,
    response,
    setResponse,
    newDialogToggle,
    setNewDialogToggle,
    setShowChangeChat,
    showChangeChat,
    changeChatModel,
    changeChatDialog,
    activeIndex,
    setActiveIndex,
    setExtendedToLeft,
    setModelInfo,
    setShowInfo,
    setEnableThinkingPrompt,

    modelContext,
    setModelContext,
    setTokenCount,
    currentDialogMessages,
    multimodalModelVision,
    setMultimodalModelVision,
    multimodalModelTools,
    setMultimodalModelTools,
    errorMessage,
    setErrorMessage,
    fullCapacityContext,
    setFullCapacityContext,
    setShowModelContext,
    getAutoNumCtx,
    lockModelContext,
    setAssistantAvatar,
    setAssistantRole,
    setAssistantTone,
    setAssistantDescription,
    setUserAvatar,
    setUserName,
    setUserBirthdate,
    setUserDescription,
    systemContext,
    setSystemContext,
    setUserImpurities,
    setAssistantImpurities,
    setSystemicImpurities,
    fetchCustomUserAssistant,
    setShowParametersBtn,
    setParametersModel,
    showUpdateModel,
    setShowUpdateModel,
    downloadModel,
    setDownloadModel,
    setNeedUpdateOllama,
  } = props;

  const [placeholder, setPlaceholder] = useState(false);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [clearStatus, setClearStatus] = useState(false);
  const [copy, setCopy] = useState(false);
  const [serverRunning, setServerRunning] = useState(false);
  const [ollamaVer, setOllamaVer] = useState("");
  const [ollamaReleaseVer, setOllamaReleaseVer] = useState("");

  const origin = window.location.origin;

  useEffect(() => {
    ollamaVersion();
  }, []);

  useEffect(() => {
    // console.log("Placeholder", placeholder);
    if (placeholder) {
      startOrContinueDialog();
    }
  }, [placeholder]); //! live like this for now to avoid errors

  useEffect(() => {
    if (clearStatus) {
      setTimeout(() => {
        setStatus("");
        setErrorMessage("");
        setClearStatus(false);
      }, 17000);
    } else {
      return;
    }
  }, [clearStatus]);

  const clickCopy = (text) => {
    if (text === null || text === undefined) {
      console.error("Text is null or undefined");
      return;
    }

    try {
      navigator.clipboard.writeText(text);
      setCopy(true);
      setTimeout(() => {
        navigator.clipboard.writeText("");
        setCopy(false);
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error occurred while copying to clipboard:", error);
    }
  };

  //! Greeting
  const greeting = () => {
    setPlaceholder((prev) => !prev);
    setNewMessage(`Hello! Tell me about something.`);
    setTokenCount(Number(7));
  };

  //! Ollama version
  const ollamaVersion = async () => {
    let verLocal = null;
    let verRelease = null;
    try {
      const response = await fetch("http://localhost:11434/api/version", {});
      const data = await response.json();
      if (data && data.version) {
        // console.log("Ollama version:", data.version);
        setOllamaVer(data.version);
        verLocal = data.version;
      } else {
        console.error("Error fetching Ollama version:", data);
      }
    } catch (error) {
      console.error("Error fetching Ollama version:", error);
    }
    try {
      const response = await fetch(
        "https://api.github.com/repos/ollama/ollama/releases/latest"
      );
      const data = await response.json();
      if (data && data.tag_name) {
        // console.log("Latest release tag:", data.tag_name.split("v")[1]);
        setOllamaReleaseVer(data.tag_name.split("v")[1]);
        verRelease = data.tag_name.split("v")[1];
      } else {
        console.error("Error fetching latest release tag:", data);
      }
    } catch (error) {
      console.error("Error fetching latest release tag:", error);
    }

    needUpdateOllama(verLocal, verRelease);
  };

  //! need update Ollama check
  const needUpdateOllama = (verLocal, verRelease) => {
    console.info("Ollama local version:", verLocal);
    console.info("Ollama release version:", verRelease);
    verLocal < verRelease
      ? (console.warn("Need update Ollama") , setNeedUpdateOllama(true))
      : (console.info("No need update Ollama"), setNeedUpdateOllama(false));
  };

  //! Choose model
  const chooseModel = (model) => {
    setModel(model);
    setEnabled(true);
    setErrorMessage("");
    fetchCustomUserAssistant(model);

    if (!model) {
      console.error("Model is null or undefined");
      return;
    }

    checkMultimodalModel(model);

    const formattedModel = model.replace(/\//g, "+");

    const request = indexedDB.open("AI_Dialogues_DB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db) {
        console.error("Database connection is null or undefined");
        return;
      }

      try {
        if (!db.objectStoreNames.contains("dialogues")) {
          indexedDB.deleteDatabase("AI_Dialogues_DB");
          console.log("Database deleted 1.");
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
      if (!store) {
        console.log("no DB");
      }

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const allDialogues = getAllRequest.result;

        // Filter dialogues by selected model name
        const filteredDialogues = allDialogues.filter(
          (dialogue) => dialogue.modelName === formattedModel
        );

        setDialogueList(filteredDialogues);
        // console.log("Filtered dialogues for selected model:", filteredDialogues);
      };

      getAllRequest.onerror = () => {
        console.error("Failed to fetch dialogues from IndexedDB");
      };
    };

    request.onerror = (event) => {
      console.error("IndexedDB open error:", event.target.error);
    };
  };

  //! Check multimodal model
  const checkMultimodalModel = async (model) => {
    const response = await fetch(`http://localhost:11434/api/show`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
      }),
    });
    if (response.ok) {
      setLoading(true);
      setStatus("Loading...");
      setProgress(0);

      // Simulate animated progress
      let simulatedProgress = 0;
      const interval = setInterval(() => {
        simulatedProgress += Math.random() * 10;
        if (simulatedProgress < 90) {
          setProgress(simulatedProgress);
        }
      }, 300);

      try {
        const response = await fetch(`http://localhost:11434/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model,
            keep_alive: -1,
          }),
        });

        clearInterval(interval);
        setProgress(100);

        if (response.ok) {
          setStatus(`Model "${model}" loaded successfully!`);
          // console.log(`Model: ${model} loaded in memory successfully`);
          setExtendedToLeft(true);
        } else {
          const error = await response.text();
          setStatus("Failed to load model.");
          console.error(`Server response: ${error}`);
          changeModel(model);
          // ollamaVersion();
          setErrorMessage(
            `"${model}" Unable to load model. Please update the ollama ${ollamaVer} to latest version (v${ollamaReleaseVer} and try again).`
          );
        }
      } catch (err) {
        clearInterval(interval);
        setProgress(100);
        setStatus("Network error.");
        console.error("1Error:", err);
      } finally {
        setLoading(false);
      }

      const data = await response.json(); // Parse the JSON response
      //? console.info("||Model data||", data); // Log the received data
      setModelInfo(data);

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          // if (key?.includes("modelfile")) {
          // console.log(`${key}:\n${value}`);
          // }
          if (key.includes("parameters")) {
            // console.log(`${key}:\n${value}`);
            setShowParametersBtn(true);
            try {
              setParametersModel((prev) => ({ ...prev, [key]: value }));
            } catch (error) {
              console.error("Error setting parameters model:", error);
            }
          }
          // if (key?.includes("template")) {
          //   console.log(`${key}:\n${value}`);
          // }
        });
      }

      if (data && data.model_info) {
        const modelInfo = data.model_info;
        Object.entries(modelInfo).forEach(([key, value]) => {
          if (key?.includes(".context_length")) {
            chrome.storage.local.get(["num_ctx"], (result) => {
              // console.log("context", result.num_ctx ?? "null");
              setModelContext(result.num_ctx ?? "null");
              if (!result.num_ctx) {
                // console.log("Test no result num_ctx");
                chrome.storage.local.get(["manual_memory"], (result) => {
                  const reportedMemory = navigator.deviceMemory ?? 4;
                  const mem = result.manual_memory ?? reportedMemory;
                  const autoCtx = result.num_ctx ?? getAutoNumCtx(mem);
                  setModelContext(autoCtx);
                  chrome.storage.local.set({ num_ctx: autoCtx });
                  // console.log("Test no result autoCtx", autoCtx);
                });
              }
            });
            setFullCapacityContext(value);
          }
          // if (key?.includes("embedding_length")) {
          //   setModelContext(value);
          // }
          if (key?.includes("basename")) {
            setModelBasename(value);
          }
          if (key?.includes("size_label")) {
            setModelSize(value);
          }
        });
      }

      if (data?.projector_info) {
        setMultimodalModel(true);
        setMultimodalModelVision(true);
        const projector = data.projector_info;
        if (projector) {
          Object.entries(projector).forEach(([key, value]) => {
            if (key?.includes("architecture")) {
              console.log(`${key}, Value: ${value}`);
            }
            // console.log(`${key}, Value: ${value}`);
          });
        }
        // console.log("Projector info: true");
      } else {
        setMultimodalModel(false);
        // console.log("Projector info: false");
      }

      if (data && data.capabilities) {
        const capabilities = data.capabilities;
        if (capabilities) {
          Object.entries(capabilities).forEach(([key, value]) => {
            if (value && value.includes("vision")) {
              setMultimodalModel(true);
              setMultimodalModelVision(true);
              // console.log(`Value Vision: ${value}`);
            }
            if (value && value.includes("tools")) {
              //setMultimodalModel(true);//! temporary close
              //setMultimodalModelTools(true);//! temporary close
              console.info(`Value Tools: ${value}`);
            }
          });
        } else {
          console.error("Capabilities is undefined or null");
        }
      }
    } else {
      console.error("Runtime error 2:", response.statusText);
      setResponse(`❌ Runtime error: ${response.statusText}`);
      setServerRunning(true);
    }
  };
  // console.log("Context", modelContext);

  //! Change model
  const changeModel = async (model) => {
    setLoading(true);
    setStatus(`Unloading model "${model}" from memory...`);
    setProgress(0);

    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += Math.random() * 10;
      if (simulatedProgress < 90) {
        setProgress(simulatedProgress);
      }
    }, 300);

    try {
      const response = await fetch(`http://localhost:11434/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          options: {
            num_ctx: modelContext,
          },
          keep_alive: 0, //! Stop the stream and unload the model from memory
        }),
      });

      clearInterval(interval);
      setProgress(100);

      if (response.ok) {
        setDialogueList([]);
        setModel(null);
        setEnabled(false);
        setMessages([]);
        setNewMessage("");
        setCurrentDialogId("");
        setCurrentDialogName("");
        setDialogName("");
        setCurrentDialogMessages([]);
        setError(false);
        setTyping(false);
        setThinking(false);
        setConnection(false);
        setFileBase64("");
        setExtendedToRight(true);
        setStopStream(false);
        setStreamError(false);
        setAssistantContext(Number(0));
        setUserContext(Number(0));
        setTotalContext(Number(0));
        setModelBasename("");
        setModelSize("");
        setResponse("");
        setServerRunning(false);
        setActiveIndex(null);
        setExtendedToLeft(true);
        setEnableThinkingPrompt([]);
        setModelContext("");
        setMultimodalModel(false);
        setMultimodalModelVision(false);
        setMultimodalModelTools(false);
        setFullCapacityContext(Number(0));
        setAssistantAvatar(null);
        setAssistantRole("");
        setAssistantTone("");
        setAssistantDescription("");
        setUserAvatar(null);
        setUserName("");
        setUserBirthdate("");
        setUserDescription("");
        setSystemContext(Number(0));
        setUserImpurities("");
        setAssistantImpurities("");
        setSystemicImpurities("");
        setShowParametersBtn(false);
        setParametersModel([]);
        if (!lockModelContext) {
          chrome.storage.local.remove(["num_ctx"], () => {
            // console.log("num_ctx cleared.");
          });
        }
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        setStatus(`Model "${model}" successfully unloaded from memory.`);
        console.log(`Model "${model}" is no longer in memory.`);
        setClearStatus(true);
      } else {
        const error = await response.text();
        setStatus("Failed to unload model.");
        console.error("Unload error:", error);
      }
    } catch (err) {
      clearInterval(interval);
      setProgress(100);
      setStatus("Network error while unloading model.");
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.clear();
  };

  //! New dialog
  const newDialogue = () => {
    setMessages([]);
    setCurrentDialogId("");
    setCurrentDialogName("");
    setCurrentDialogMessages([]);
    setNewDialogToggle(!newDialogToggle);
    setTotalContext(Number(0));
    setAssistantContext(Number(0));
    setUserContext(Number(0));
  };

  //! Download dialog
  const handleDownloadDialog = (currentDialogId) => {
    try {
      const currentDialog = dialogueList.find(
        (dialogue) => dialogue.initId === currentDialogId
      );
      if (!currentDialog) {
        console.error(`No dialogue found with id ${currentDialogId}`);
        return;
      }
      const currentDialogMessages = currentDialog.messages;
      if (!currentDialogMessages) {
        console.error("No messages found in dialogue.");
        return;
      }
      // const blob = new Blob([JSON.stringify(dialogueList, null, 4)], {
      //   type: "application/json",
      // }); //! Download all dialogues as a single file from IndexedDB
      const blob = new Blob([JSON.stringify(currentDialogMessages, null, 4)], {
        type: "application/json",
      }); //! Download current dialogue
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${model}_-_${currentDialogName}.json`;
      link.click();
    } catch (err) {
      console.error("Error while downloading dialogue:", err);
    }
  };

  // const handleUploadDialog = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const data = JSON.parse(e.target.result);
  //       setDialogueList(prevDialogues => [...prevDialogues, ...data]);
  //     } catch (err) {
  //       console.error("Error while parsing JSON:", err);
  //     }
  //   };
  //   reader.readAsText(file);
  // }

  //! Calculate total context tokens
  useEffect(() => {
    if (currentDialogMessages) {
      try {
        let num = 0;
        Object.entries(currentDialogMessages).forEach(([_, message]) => {
          if (message && typeof message === "object") {
            Object.entries(message).forEach(([key, value]) => {
              if (key.includes("token") && typeof value === "number") {
                num += value;
              }
            });
          }
        });
        setTotalContext(num);
      } catch (error) {
        console.error("Error processing dialog messages:", error);
      }
    } else {
      console.error("No messages found in current dialog.");
    }
  }, [currentDialogMessages]);

  return (
    <>
      <div className="chatAiMessengerHeaderSelector">
        {enabled && !response && (
          <>
            <div
              className="chatAiMessengerHeaderBtn"
              onClick={() => changeModel(model)}
            >
              <p className="chatAiMessengerHeaderBtnText">Eject</p>
              {/* <RestartAlt className="iconTransformScale" /> */}
              <Eject className="iconTransformScale" />
            </div>
            {/* <InfoOutline
              className="iconTransformScale"
              onClick={() => {
                setShowInfo(true);
              }}
            /> */}
            <SettingsOutlined
              className="iconTransformScale"
              onClick={() => {
                setExtendedToRight(true);
                setShowSettings(true);
              }}
            />
          </>
        )}

        {enabled && !response ? (
          <>
            <p
              className={`chatAiMessengerModelSelected ${
                progress === 100 ? "done" : ""
              }`}
            >
              {" "}
              {model}{" "}
            </p>

            <p className={`statusText ${progress === 100 ? "done" : ""}`}>
              {status}
            </p>
          </>
        ) : (
          <div className="selectContainer">
            {!response && (
              <select
                className="select"
                onChange={(e) => chooseModel(e.target.value)}
                name="model"
                id=""
                disabled={enabled}
                style={{ textTransform: "capitalize" }}
              >
                <option
                  className="chatAiMessengerModel"
                  style={{ textAlign: "center" }}
                  value={undefined}
                >
                  {model ? model : "Select your model AI"}
                </option>
                {modelList.map((m, i) => (
                  <option
                    className="chatAiMessengerModel"
                    key={i + new Date()}
                    value={m.model}
                  >
                    {/* {`(${m.model.length}) ${m.model}`} */}
                    {m.model.includes("/") ? m.model.split("/").pop() : m.model}
                  </option>
                ))}
              </select>
            )}
            <p
              className={`statusText ${progress === 0 ? "done" : ""} ${
                errorMessage ? "error" : ""
              } statusTextAbsolute`}
            >
              {errorMessage ? errorMessage : status}
            </p>
            {!response && (
              <img
                className="chatAiMessengerHeroAvatar"
                src="icons/avatarAi.png"
                alt="AI_avatar"
              />
            )}
            {errorMessage && (
              <div
                className="chatAiMessengerErrorUnableToLoad errorMessageHide"
                onClick={() => window.location.reload()}
              >
                <SickOutlined
                  className="iconTransformScale errorMessageHide"
                  style={{ color: "var(--red)", fontSize: "3rem" }}
                />
              </div>
            )}
            {response && (
              <div className={`responseContainer`}>
                <p className={`responseTextError`}>{response}</p>

                {serverRunning && (
                  <p className="responseTextServerError">
                    You already have Ollama running on your computer without
                    CORS for this extension. Please follow the steps below.
                  </p>
                )}
                <br />
                <p className="responseText">
                  1. Press <span>Windows + X</span> and choose <br />
                  <span>Windows PowerShell</span>,<br />
                  2. then run: <br />
                  <div
                    className="responseTextCode"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.location) {
                        try {
                          const textToCopy = serverRunning
                            ? `taskkill /F /IM ollama.exe 2>$null; taskkill /F /IM "ollama app.exe" 2>$null; $env:OLLAMA_ORIGINS="${window.location.origin}"; ollama serve`
                            : `$env:OLLAMA_ORIGINS="${window.location.origin}"; ollama serve`;
                          clickCopy(textToCopy);
                        } catch (err) {
                          console.error("Error while copying text:", err);
                        }
                      }
                    }}
                  >
                    <div className="responseTextCodeHeader">
                      {copy ? (
                        <span style={{ color: "var(--green)" }}>Copied</span>
                      ) : (
                        <span>Copy</span>
                      )}
                      <span>
                        {copy ? (
                          <ContentPaste fontSize="small" />
                        ) : (
                          <ContentCopy fontSize="small" />
                        )}
                      </span>
                    </div>
                    {/* //! Close the already running Ollama {">"}=&gt
                    //! Close the already running Ollama
                    //! Set the OLLAMA_ORIGINS environment variable
                    //! Run the Ollama server 
                    // */}
                    {serverRunning ? (
                      <code>
                        taskkill /F /IM ollama.exe 2&gt;$null; taskkill /F /IM
                        "ollama app.exe" 2&gt;$null; $env:OLLAMA_ORIGINS="
                        {window.location.origin}"; ollama serve
                      </code>
                    ) : (
                      <code>
                        $env:OLLAMA_ORIGINS="{window.location.origin}"; ollama
                        serve
                      </code>
                    )}
                  </div>
                  <div className="responseTextRefresh">
                    <p className="responseText">3. And press</p>
                    <Button
                      name="Refresh"
                      icon={<Cached color="action" fontSize="small" />}
                      onClick={() => window.location.reload()}
                    />
                    <br />
                    <p className="responseText">to reload the page.</p>
                  </div>
                </p>
              </div>
            )}
            {!response && (
              <Button
                className={"chatAiMessengerHeaderDownloadBtn"}
                name="Pull a Model"
                onClick={() => {
                  setDownloadModel(true);
                  setShowUpdateModel(true);
                }}
              />
            )}
            {showUpdateModel && (
              <PopupUpdateModel
                {...{
                  setShowUpdateModel,
                  setDownloadModel,
                  downloadModel,
                  model,
                  chooseModel,
                  ollamaVer,
                  ollamaReleaseVer,
                }}
              />
            )}
          </div>
        )}
        {enabled &&
          !response &&
          (currentDialogId === "" ? (
            messages.length > 1 ? (
              <>
                {!errorMessage && (
                  <>
                    <SaveOutlined
                      className="iconTransformScale"
                      onClick={() => setSaveDialog(true)}
                    />
                    <div
                      className="chatAiMessengerHeaderBtn"
                      onClick={() => newDialogue()}
                    >
                      <EditNote className="iconTransformScale" />
                      <p className="chatAiMessengerHeaderBtnText">New Chat</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <WavingHandOutlined
                className="iconTransformScale"
                onClick={() => greeting()}
              />
            )
          ) : (
            <>
              {!errorMessage && (
                <div
                  className="chatAiMessengerHeaderBtn"
                  onClick={() => newDialogue()}
                >
                  <EditNote className="iconTransformScale" />
                  <p className="chatAiMessengerHeaderBtnText">New Chat</p>
                </div>
              )}
            </>
          ))}
      </div>
      {enabled && !response && (
        <>
          {modelContext > 0 && (
            <div className="progressBarContainerLine">
              {totalContext > 0 && (
                <p className="progressBarContainerLineText">{totalContext}</p>
              )}
              <progress
                value={totalContext}
                // max={4096}
                max={modelContext}
                className="chatAiMessengerProgress"
              />{" "}
              {totalContext > (systemContext || 0) ? (
                <>
                  <p
                    className="progressBarContainerLineText"
                    style={
                      fullCapacityContext != null &&
                      modelContext != null &&
                      fullCapacityContext < modelContext
                        ? { color: "var(--red)", display: "flex" }
                        : { display: "none" }
                    }
                  >
                    {fullCapacityContext != null
                      ? fullCapacityContext - totalContext
                      : ""}
                  </p>
                  <p className="progressBarContainerLineText">
                    {modelContext - totalContext}
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="progressBarContainerBtnModelContext"
                    onClick={() => setShowModelContext(true)}
                  >
                    <p
                      className="progressBarContainerLineText"
                      style={
                        fullCapacityContext != null &&
                        modelContext != null &&
                        fullCapacityContext < modelContext
                          ? { color: "var(--red)", display: "flex" }
                          : { display: "none" }
                      }
                    >
                      {fullCapacityContext != null ? fullCapacityContext : ""}
                    </p>
                    <p
                      className="progressBarContainerLineText"
                      style={
                        fullCapacityContext != null &&
                        modelContext != null &&
                        fullCapacityContext < modelContext
                          ? {
                              color: "var(--red)",
                              textDecoration: "line-through",
                            }
                          : {}
                      }
                    >
                      {modelContext != null ? modelContext : "N/A"}
                    </p>
                    <sup>
                      <QuestionMark style={{ fontSize: "0.6rem" }} />
                    </sup>
                  </div>
                </>
              )}
            </div>
          )}
          <div
            className={`progressBarContainer ${progress === 100 ? "done" : ""}`}
          >
            <div
              className={`progressBar ${
                status.includes("error") ? "error" : ""
              } ${progress === 100 ? "done" : ""}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="chatAiMessengerHeaderTitle">
            <p
              className="chatAiMessengerHeaderTitleOne"
              style={
                currentDialogId === ""
                  ? { color: "orange", letterSpacing: "1.2px" }
                  : { color: "green", letterSpacing: "1.2px" }
              }
              onClick={() => handleDownloadDialog(currentDialogId)}
            >
              {currentDialogName}
              {currentDialogId !== "" && (
                <DownloadOutlined
                  className="iconTransformScale"
                  style={{ color: "var(--gray)", fontSize: "1.2rem" }}
                />
              )}
            </p>
            <p
              className="chatAiMessengerHeaderTitleTwo"
              style={{ color: "red" }}
            >
              {error ? "3Error:" : `${dialogName}`}
            </p>
            {currentDialogId === "" &&
              messages.length > 1 &&
              currentDialogName === "" && (
                <p
                  className="chatAiMessengerHeaderTitleTwo"
                  style={{ color: "red", textTransform: "lowercase" }}
                >
                  {error ? error?.response.statusText : "unsaved dialogue"}
                </p>
              )}
          </div>
          {showChangeChat && (
            <PopupChangeChat
              {...{
                model,
                setShowChangeChat,
                showChangeChat,
                changeChatModel,
                changeChatDialog,
                currentDialogName,
                setMessages,
                setCurrentDialogId,
                setCurrentDialogName,
                setCurrentDialogMessages,
                changeModel,
                chooseModel,
              }}
            />
          )}
        </>
      )}
    </>
  );
}
