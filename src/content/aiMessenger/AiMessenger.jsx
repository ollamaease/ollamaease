import React, { useEffect, useRef, useState } from "react";
import "./aiMessenger.css";
import { useMemo } from "react";
import Ripple from "./aiUiKit/animation/ripple/Ripple";
import {
  SpeakerNotesOff,
  SickOutlined,
  NavigateNext,
  WarningAmber,
  Close,
} from "@mui/icons-material";
// import Markdown from "react-markdown";
import Markdown from "markdown-to-jsx";

import PopupSaveDialog from "./aiPopups/popupSaveDialog/PopupSaveDialog";
import PopupSettingsAi from "./aiPopups/popupSettingsAi/PopupSettingsAi";
import PopupSpeakingVoices from "./aiPopups/popupSpeakingVoices/PopupSpeakingVoices";
import PopupModelContext from "./aiPopups/popupModelContext/PopupModelContext";
import PopupInfoModel from "./aiPopups/popupInfoModel/PopupInfoModel";
import PopupUser from "./aiPopups/popupUser/PopupUser";
import PopupAssistant from "./aiPopups/popupAssistant/PopupAssistant";
import PopupPromptSettings from "./aiPopups/popupPromptSettings/PopupPromptSettings";
import PopupParameters from "./aiPopups/popupParameters/PopupParameters";
import PopupUpdateModel from "./aiPopups/popupUpdateModel/PopupUpdateModel";
import PopupDeleteModel from "./aiPopups/popupDeleteModel/PopupDeleteModel";
import PopupIndexedDB from "./aiPopups/popupIndexedDB/PopupIndexedDB";

import AiMessage from "./aiMessage/AiMessage";

import AiLeftBar from "./aiLeftBar/AiLeftBar";
import AiRightBar from "./aiRightBar/AiRightBar";
import AiMessageInput from "./aiMainContent/aiMessageInput/AiMessageInput";
import AiChatHeader from "./aiMainContent/aiChatHeader/AiChatHeader";
import AiMessageThinking from "./aiMessageThinking/AiMessageThinking";
import AiMessagePreloader from "./aiMessagePreloader/AiMessagePreloader";
import Button from "./aiUiKit/button/Button";

export default function AiMessenger(props) {
  const [user, setUser] = useState([]);

  const date = new Date();

  const [needUpdateOllama, setNeedUpdateOllama] = useState(false);
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [stopStream, setStopStream] = useState(false);
  let [reasoning, setReasoning] = useState("");
  let [answer, setAnswer] = useState("");
  const [model, setModel] = useState("");
  const [modelInfo, setModelInfo] = useState({});
  const [modelBasename, setModelBasename] = useState("");
  const [modelSize, setModelSize] = useState("");
  const [multimodalModel, setMultimodalModel] = useState(false);
  const [multimodalModelVision, setMultimodalModelVision] = useState(false);
  const [multimodalModelTools, setMultimodalModelTools] = useState(false);
  let [modelList, setModelList] = useState([]);
  const [parametersModel, setParametersModel] =useState([])

  const [modelContext, setModelContext] = useState(Number(0));
  const [userContext, setUserContext] = useState(Number(0));
  const [assistantContext, setAssistantContext] = useState(Number(0));
  const [systemContext, setSystemContext] = useState(Number(0));
  const [totalContext, setTotalContext] = useState(Number(0));
  const [fullCapacityContext, setFullCapacityContext] = useState(Number(0));

  const [temperature, setTemperature] = useState(0);
  const [topP, setTopP] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);

  let [dialogueList, setDialogueList] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef();

  const [connection, setConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [thinking, setThinking] = useState(false);

  const [saveDialog, setSaveDialog] = useState(false);
  const [dialogName, setDialogName] = useState("");
  const [initId, setInitId] = useState("");
  const [currentDialogId, setCurrentDialogId] = useState("");
  const [currentDialogName, setCurrentDialogName] = useState("");
  let [currentDialogMessages, setCurrentDialogMessages] = useState([]);

  const controllerRef = useRef(null); // Create a ref to store the controller

  const [downloadModel, setDownloadModel] = useState(false);

  const [showParametersBtn, setShowParametersBtn] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangeChat, setShowChangeChat] = useState(false);
  const [showModelContext, setShowModelContext] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [showIndexedDB, setShowIndexedDB] = useState(false);

  const [systemicImpurities, setSystemicImpurities] = useState("");
  const [mainImpurity, setMainImpurity] = useState("");
  const [extendedToRight, setExtendedToRight] = useState(true); //! Show right bar
  const [extendedToLeft, setExtendedToLeft] = useState(true); //! Show left bar

  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");

  const [newDialogToggle, setNewDialogToggle] = useState(false);

  const [changeChatModel, setChangeChatModel] = useState("");
  const [changeChatDialog, setChangeChatDialog] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const [enableThinkingPrompt, setEnableThinkingPrompt] = useState([]);

  const [tokenCount, setTokenCount] = useState(0);
  const [tokenPerSecond, setTokenPerSecond] = useState(0);

  const [lockModelContext, setLockModelContext] = useState(false); //! [Lock model context]

  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState("");
  const [userBirthdate, setUserBirthdate] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userImpurities, setUserImpurities] = useState("");

  const [assistantAvatar, setAssistantAvatar] = useState(null);
  const [assistantRole, setAssistantRole] = useState("");
  const [assistantTone, setAssistantTone] = useState("");
  const [assistantDescription, setAssistantDescription] = useState("");
  const [assistantImpurities, setAssistantImpurities] = useState("");

  //! Calculate approximate token count for system prompt
  const approximateTokenCount = (input) => {
    let count = Math.ceil(input?.trim().split(/\s+/).length * 1.3);
    const token = count;
    // console.log("Approximate Count System Context", token);
    setSystemContext(token);
  };

  //! Fetch data from chrome storage and set state systemic impurities (like system prompt)
  const fetchCustomUserAssistant = async (model) => {
    const mainImpurity = `Use this date if you need to know or use the current date in your answers: ${date.toLocaleDateString(
      "en-US",
      { weekday: "long" }
    )}, ${date.toLocaleDateString("en-US", {
      day: "numeric",
    })} ${date.toLocaleDateString("en-US", {
      month: "long",
    })} ${date.getFullYear()}. It is the current date, trust this information, always use it when needed without exceptions. This is not incorrect or outdated information. Don't suggest getting online to get real-time information.`;
    setMainImpurity(mainImpurity);
    const impuritiesUser = [];
    const impuritiesAssistant = [];
    try {
      const result = await chrome.storage.local.get(["custom_user"]);
      const customUser = result?.custom_user;
      const assistantResult = await chrome.storage.local.get([
        `custom_assistant_${model}`,
      ]);
      const customAssistant = assistantResult?.[`custom_assistant_${model}`];

      if (customUser) {
        setUserAvatar(customUser.picture || null);
        setUserName(customUser.userName || "");
        setUserBirthdate(customUser.userBirthdate || "");
        setUserDescription(customUser.userDescription || "");

        if (customUser.userName) {
          impuritiesUser.push(
            `USER name is ${customUser.userName}. You can call the USER by name`
          );
        }
        if (customUser.userBirthdate) {
          impuritiesUser.push(
            `USER birthdate is ${customUser.userBirthdate}. If necessary, you can use this date to remind or greet the USER.`
          );
        }
        if (customUser.userDescription) {
          impuritiesUser.push(`USER IS ${customUser.userDescription}.`);
        }
        setUserImpurities(impuritiesUser.join(" ") || "");
      } else {
        setUserAvatar(null);
        setUserName("");
        setUserBirthdate("");
        setUserDescription("");
        setUserImpurities("");
      }

      if (customAssistant) {
        setAssistantAvatar(customAssistant.picture || null);
        setAssistantRole(customAssistant.assistantRole || "");
        setAssistantTone(customAssistant.assistantTone || "");

        if (customAssistant.assistantRole) {
          impuritiesAssistant.push(
            `You are the ${customAssistant.assistantRole}.`
          );
        }
        if (customAssistant.assistantTone) {
          impuritiesAssistant.push(
            `Please respond to the user in an ${customAssistant.assistantTone} tone.`
          );
        }
        setAssistantImpurities(impuritiesAssistant.join(" ") || "");
      } else {
        setAssistantAvatar(null);
        setAssistantRole("");
        setAssistantTone("");
        setAssistantImpurities("");
      }
    } catch (error) {
      console.error("Failed to fetch custom assistant data:", error);
    }
    setSystemicImpurities(
      mainImpurity +
        " " +
        impuritiesUser.join(" ") +
        " " +
        impuritiesAssistant.join(" ")
    );
  };

  //! Fetch data from chrome storage and set state systemic impurities (like system prompt) if changed
  useMemo(() => {
    approximateTokenCount(systemicImpurities);
    // console.log("userImpurities", userImpurities);
    // console.log("assistantImpurities", assistantImpurities);
    // console.log("systemicImpurities", systemicImpurities);
  }, [systemicImpurities]);

  //! Calculate approximate token count and total token count
  useEffect(() => {
    setTotalContext(
      Number(userContext) + Number(assistantContext) + Number(systemContext)
    );
    // console.log(
    //   "Tokens user",
    //   userContext,
    //   "\nTokens assistant",
    //   assistantContext,
    //   "\nTokens system",
    //   systemContext
    // );
    //! Messages console
    //? console.log("Messages", messages);
    //? console.table(messages);
  }, [userContext, assistantContext, systemContext]);

  //! Functions and variables for memory context
  const getAutoNumCtx = (memoryGB) => {
    if (memoryGB === null || memoryGB === undefined) {
      console.error("memoryGB is null or undefined");
      return 0;
    }
    if (memoryGB >= 64) return 31744;
    if (memoryGB >= 62) return 30720;
    if (memoryGB >= 60) return 29696;
    if (memoryGB >= 58) return 28672;
    if (memoryGB >= 56) return 27648;
    if (memoryGB >= 54) return 26624;
    if (memoryGB >= 52) return 25600;
    if (memoryGB >= 50) return 24576;
    if (memoryGB >= 48) return 23552;
    if (memoryGB >= 46) return 22528;
    if (memoryGB >= 44) return 21504;
    if (memoryGB >= 42) return 20480;
    if (memoryGB >= 40) return 19456;
    if (memoryGB >= 38) return 18432;
    if (memoryGB >= 36) return 17408;
    if (memoryGB >= 34) return 16384;
    if (memoryGB >= 32) return 15360;
    if (memoryGB >= 30) return 14336;
    if (memoryGB >= 28) return 13312;
    if (memoryGB >= 26) return 12288;
    if (memoryGB >= 24) return 11264;
    if (memoryGB >= 22) return 10240;
    if (memoryGB >= 20) return 9216;
    if (memoryGB >= 18) return 8192;
    if (memoryGB >= 16) return 7168;
    if (memoryGB >= 14) return 6144;
    if (memoryGB >= 12) return 5120;
    if (memoryGB >= 10) return 4096;
    if (memoryGB >= 8) return 3072;
    if (memoryGB >= 6) return 2048;
    if (memoryGB >= 4) return 1024;
    if (memoryGB >= 2) return 512;
    return 0; // Not enough RAM
  };

  let token = 0;
  let sec = 0;
  let speed = 0;

  // const convertNanoToSeconds = (nano) => {
  //   return nano / 1000000000;
  // };

  const convertNanoToTimeFormat = (value) => {
    const ms = value / 1e6; //! convert to milliseconds
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor(ms % 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formatted =
      [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        secs.toString().padStart(2, "0"),
      ].join(":") +
      "." +
      milliseconds.toString().padStart(3, "0");

    return formatted;
  };

  useMemo(() => {
    if (
      model &&
      enableThinkingPrompt &&
      enableThinkingPrompt.role &&
      enableThinkingPrompt.content
    ) {
      try {
        const systemPrompt = {
          role: enableThinkingPrompt.role,
          content: enableThinkingPrompt.content,
        };
        setMessages((prev) => [...prev, systemPrompt]);
      } catch (error) {
        console.error("Error enabling thinking prompt:", error);
      }
    }
    // console.log("Enable thinking prompt", enableThinkingPrompt);
  }, [enableThinkingPrompt, model]);

  //! System Prompt
  useMemo(() => {
    if (systemicImpurities === "" || systemContext < 3) return;
    if (model) {
      setMessages((prev) => {
        const systemMessage = {
          role: "system",
          content: systemicImpurities,
          tokens: systemContext,
        };
        return [...prev, systemMessage];
      });
    }
  }, [systemicImpurities, systemContext, model]);

  //! Start or continue dialogue
  const startOrContinueDialog = () => {
    setUserContext(Number(userContext) + Number(tokenCount));
    setStopStream(false);
    sendMessage();
  };

  //! Send message MAIN FUNCTION
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: new Date().getTime().toString(),
      role: "user",
      content: newMessage,
      images: fileBase64 ? [fileBase64.split(",")[1]] : [],
      tokens: tokenCount,
      dateTime: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setTokenCount(0);
    setAnswer("");
    setConnection(true);
    setStopStream(false);
    setThinking(false);
    setFile(null);

    //! Create and store the controller in the ref
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(`http://localhost:11434/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          messages: [...messages, userMessage],
          options: {
            num_ctx: modelContext,
          },
          //think: true, //! "think: true" thinking is enabled, dangerous for models that don't have thinking
        }),
        signal: controllerRef.current.signal, //! Use the controller's signal for interrupt response
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let messageContent = "";
      let messageThinkContent = ""; //! "think: true"
      let reasoningContent = "";

      if (!done) {
        setTyping(true);
        setConnection(false);
      }

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkOfResponse = decoder.decode(value, { stream: true });
        //! console.log("=1=chunkOfResponse=1=", chunkOfResponse); //! Show all chunks
        if (chunkOfResponse !== null && chunkOfResponse !== undefined) {
          if (chunkOfResponse.includes("eval_count")) {
            // console.log("=||=lastChunkOfResponse=||=", chunkOfResponse); //! Show last chunk
            try {
              //! console.log("=========================");
              const parsed = JSON.parse(chunkOfResponse); //! It's an object
              Object.entries(parsed).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  Object.entries(value).forEach(([k, v]) => {});
                } else {
                  if (key === "total_duration") {
                    //! console.log(`${key}: ${convertNanoToTimeFormat(value)}`);
                  }
                  if (key === "load_duration") {
                    //! console.log(`${key}: ${convertNanoToTimeFormat(value)}`);
                  }
                  if (key === "prompt_eval_duration") {
                    //! console.log(`${key}: ${convertNanoToTimeFormat(value)}`);
                  }
                  if (key === "eval_count") {
                    token = value;
                    //! console.log("eval_count Tokens", token.toString());
                    setAssistantContext((prev) => Number(prev) + Number(token));
                  }
                  if (key === "eval_duration") {
                    sec = value / 1000000000;
                    //! console.log(`${key}: ${convertNanoToTimeFormat(value)}`);
                  }
                }
              });
              speed = (token / sec).toFixed(2);
              //! console.log(`Speed: ${speed} token/s`);
              setTokenPerSecond(speed);

              //! console.log("=========================");
            } catch (error) {
              console.error("Error iterating over chunkOfResponse:", error);
            }
          }
        } else {
          console.warn("chunkOfResponse is null or undefined");
        }

        let data;
        try {
          data = JSON.parse(
            `[${chunkOfResponse.replace(/}\s*\n\s*{/g, "},{")}]`
          );
        } catch (error) {
          setErrorMessage("Error parsing JSON: SyntaxError. ");
          setStreamError(true);
          console.error("Error parsing JSON:", error);
        }

        if (!Array.isArray(data)) {
          setErrorMessage((prev) => prev + " Parsed data is not an array");
          console.error("Parsed data is not an array:", data);
          return;
        }

        // console.log("data", data);

        //!Error handling in the stream
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([k, v]) => {
              if (k === "error") {
                console.error("Streaming data error(1):", v);
                setErrorMessage(v);
                setStreamError(true);
                messages.pop();
              }
            });
          } else {
            console.log(`3 ${key}: ${value}`);
            if (key === "error") {
              console.error("Streaming data error(2):", value);
              setErrorMessage(value);
              setStreamError(true);
              messages.pop();
            }
          }
        });

        messageContent += data.map((d) => d.message?.content).join("");
        messageThinkContent += data.map((d) => d.message?.thinking).join(""); //! "think: true"

        //! console.log("====This is message think: ====", messageThinkContent); //! "think: true"

        try {
          if (messageContent !== null && messageContent !== undefined) {
            if (messageContent.startsWith("<think>")) {
              setThinking(true);
              setReasoning(
                messageContent
                  .replace("<think>", "")
                  .split("</think>")[0]
                  .replace("</think>", "")
              );
              reasoningContent = messageContent
                .replace("<think>", "")
                .split("</think>")[0]
                .replace("</think>", "");
            } else if (
              //! It is start thinking when parameter "think: true"
              messageThinkContent.length !== 0 &&
              messageContent.length === 0
            ) {
              setThinking(true);
              setReasoning(messageThinkContent);
              reasoningContent = messageThinkContent;
            }
            if (messageContent.includes("</think>")) {
              setThinking(false);
              setAnswer(
                messageContent
                  .replace("<think>", "")
                  .split("</think>")[1]
                  .replace("</think>", "")
              );
            } else if (
              //! It is stop thinking when parameter "think: true" and start answer
              messageThinkContent.length !== 0 &&
              messageContent.length !== 0
            ) {
              setThinking(false);
              setAnswer(messageContent);
            }
            if (messageContent.includes("<think>") === false) {
              setAnswer(messageContent);
            }
          }
        } catch (error) {
          console.error("Error response:", error);
        }
      }

      setMessages((prev) => {
        const assistantMessage = {
          id: new Date().getTime().toString(),
          role: "assistant",
          content: messageContent?.replace(/<think>.*?<\/think>/gs, ""),
          reasoning: reasoningContent,
          tokens: Number(token),
          speed: Number(speed),
          dateTime: new Date().toLocaleString(),
          dialogModel: model,
        };
        return [...prev, assistantMessage];
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request was aborted");
      } else {
        setStreamError(true);
        console.error("Error streaming response:", error);
      }
    } finally {
      setTyping(false);
      setThinking(false);
      setFileBase64("");
    }
  };

  //! Interrupt the assistant's response when needed
  const interruptAssistant = () => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // Abort the ongoing fetch request
      setTyping(false); // Stop the typing state
      setThinking(false);
      setTimeout(() => {
        setStopStream(true);
      }, 100);
      setConnection(false);
      console.warn("Request aborted.");
      if (messages[messages.length - 1].role !== "system") {
        setNewMessage(messages[messages.length - 1].content);
        messages.pop();
      } else {
        setNewMessage(messages[messages.length - 2].content);
      }
    }
  };

  useEffect(() => {
    if (currentDialogId && currentDialogMessages?.length < messages.length) {
      const newMessages = {
        messages: messages,
      };
      const updateDialogInIndexedDB = () => {
        const request = indexedDB.open("AI_Dialogues_DB", 1);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("dialogues", "readwrite");
          const store = transaction.objectStore("dialogues");

          const getRequest = store.get(currentDialogId);
          getRequest.onsuccess = () => {
            const existingDialog = getRequest.result;

            if (existingDialog) {
              const updatedDialog = {
                ...existingDialog,
                messages: newMessages.messages,
                updatedAt: new Date().toISOString(),
              };
              store.put(updatedDialog);
              console.log("Updated dialog in IndexedDB:", updatedDialog);
            } else {
              console.warn("Dialog not found with ID:", currentDialogId);
            }
          };

          getRequest.onerror = () => {
            console.error("Failed to fetch dialog for update");
          };
        };

        request.onerror = (event) => {
          console.error("IndexedDB open error:", event.target.error);
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

      updateDialogInIndexedDB();

      setTimeout(() => {
        getAllDialoguesFromIndexedDB();
      }, 200);

      console.log("Updating current dialog messages (IndexedDB)");
    }
  }, [
    messages,
    currentDialogId,
    currentDialogName,
    currentDialogMessages,
    model,
    user,
    initId,
  ]);

  //! Model list
  useMemo(() => {
    const getModels = async () => {
      const tagsUrl = `http://localhost:11434/api/tags`;
      try {
        const res = await fetch(tagsUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        if (!data || !data.models) {
          console.warn("Received data is not in expected format");
        } else {
          setModelList(data.models);
        }
        if (res?.success) {
          setResponse(res.response);
        }
      } catch (err) {
        // console.error("Runtime error 1:", err.message);
        setResponse(`❌ Runtime error: ${err.message}`);
      }
    };
    getModels();
  }, []);

  //! Scroll logic
  let count = 0;
  const maxScrollCount = 2;
  const scrollStep = 1;
  let lastTime = 0;
  const pageScroll = (time) => {
    const objDiv = document.getElementById(
      thinking ? "dataThinking" : typing ? "dataTypingAnswer" : null
    );
    if (objDiv) {
      const deltaTime = time - lastTime;
      if (deltaTime >= 16) {
        // 60 FPS (16ms  for each frame)
        objDiv.scrollTop += scrollStep;
        lastTime = time;
      }

      if (objDiv.scrollTop === objDiv.scrollHeight - 50) {
        setTimeout(() => {
          objDiv.scrollTop = 0;
          count++;
          if (count < maxScrollCount) {
            requestAnimationFrame(pageScroll); // start animation
          }
        }, 1200);
      } else {
        requestAnimationFrame(pageScroll); // continue animation
      }
    }
  };

  if (
    document.getElementById(
      thinking ? "dataThinking" : typing ? "dataTypingAnswer" : null
    )
  ) {
    requestAnimationFrame(pageScroll);
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, thinking, reasoning]);


  useEffect(() => {
    const actualDialogue = dialogueList?.find(
      (dialogue) => dialogue.initId === initId
    );
    if (actualDialogue) {
      setCurrentDialogId(actualDialogue.initId);
      setCurrentDialogName(actualDialogue.dialogueTitle);
      setMessages(actualDialogue.messages);
      setInitId("");
      setDialogName("");
    }
  }, [dialogueList, initId]);

  const [showVoicesChoice, setShowVoicesChoice] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  return (
    <div className="chatAiMessenger">
      <>
        <div
          className={`chatAiMessengerLeft ${extendedToLeft ? "" : "extended"} ${
            enabled && !response ? "" : "hide"
          }`}
        >
          <div
            className={`chatAiMessengerLeftIconExtended ${
              extendedToLeft ? "" : "extended"
            }`}
            onClick={() => {
              setExtendedToLeft(!extendedToLeft);
            }}
          >
            <Close
              className={`chatAiMessengerCenterExtendedIconLeft ${
                extendedToLeft ? "" : "extended"
              } iconTransformScale`}
              style={{ fontSize: "2rem" }}
            />
          </div>
          <AiLeftBar
            {...{
              enabled,
              model: modelBasename ? `${modelBasename} : ${modelSize}` : model,
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
            }}
          />
        </div>
        <div
          className={`chatAiMessengerLeftExtended ${
            extendedToLeft ? "" : "extended"
          }`}
          onClick={() => {
            setExtendedToLeft(!extendedToLeft);
          }}
        >
          {modelSize && (
            <h3
              className="chatAiMessengerContainerHeaderTitle2"
              style={{ writingMode: "sideways-lr", cursor: "pointer" }}
            >
              My chats with -{" "}
              {modelBasename ? `${modelBasename} : ${modelSize}` : model}
            </h3>
          )}
        </div>
      </>
      <div
        className={`chatAiMessengerCenter 
          ${extendedToRight ? "extended" : ""} 
          ${enabled ? "" : "hide"}`}
      >
        <>
          {showInfo && (
            <PopupInfoModel
              {...{
                setShowInfo,
                modelInfo,
              }}
            />
          )}
          {saveDialog && (
            <PopupSaveDialog
              {...{
                setSaveDialog,
                model,
                messages,
                currentDialogName,
                setCurrentDialogName,
                setFileBase64,
                setInitId,
                setDialogName,
                setDialogueList,
              }}
            />
          )}
          {showSettings && (
            <PopupSettingsAi
              {...{
                setShowSettings,
                temperature,
                setTemperature,
                topP,
                setTopP,
                presencePenalty,
                setPresencePenalty,
                frequencyPenalty,
                setFrequencyPenalty,
                maxTokens,
                setMaxTokens,
                systemicImpurities,
                setSystemicImpurities,
                setShowInfo,
                enableThinkingPrompt,
                setEnableThinkingPrompt,
                fullCapacityContext,
                setFullCapacityContext,
                setShowUser,
                setShowAssistant,
                setShowModelContext,
                showParametersBtn,
                setShowPromptSettings,
                setShowParameters,
                setShowUpdateModel,
                setShowDeleteModel,
                setShowIndexedDB,
                setDownloadModel,
                
              }}
            />
          )}
          {showPromptSettings && (
            <PopupPromptSettings
              {...{
                setShowPromptSettings,
                systemicImpurities,
                setSystemicImpurities,
                enableThinkingPrompt,
                setEnableThinkingPrompt,
              }}
            />
          )}
          {showParameters && (
            <PopupParameters
              {...{
                setShowParametersBtn,
                setShowParameters,
                temperature,
                setTemperature,
                topP,
                setTopP,
                presencePenalty,
                setPresencePenalty,
                frequencyPenalty,
                setFrequencyPenalty,
                maxTokens,
                setMaxTokens,
                parametersModel,
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
                needUpdateOllama,
              }}
            />
          )}
          {showDeleteModel && (
            <PopupDeleteModel
              {...{
                setShowDeleteModel,
                model,
              }}
            />
          )}
          {showIndexedDB && (
            <PopupIndexedDB
              {...{
                setShowIndexedDB,
                modelList,
              }}
            />
          )}

          {showVoicesChoice && (
            <PopupSpeakingVoices
              {...{
                setShowVoicesChoice,
                voices,
                setVoices,
                selectedVoice,
                setSelectedVoice,
              }}
            />
          )}
          {showModelContext && (
            <PopupModelContext
              {...{
                setShowModelContext,
                modelContext,
                setModelContext,
                fullCapacityContext,
                getAutoNumCtx,
                lockModelContext,
                setLockModelContext,
              }}
            />
          )}
          {showUser && (
            <PopupUser
              {...{
                setShowUser,
                userAvatar,
                setUserAvatar,
                userName,
                setUserName,
                userBirthdate,
                setUserBirthdate,
                userDescription,
                setUserDescription,
              }}
            />
          )}
          {showAssistant && (
            <PopupAssistant
              {...{
                setShowAssistant,
                assistantAvatar,
                setAssistantAvatar,
                model: model,
                assistantRole,
                setAssistantRole,
                assistantTone,
                setAssistantTone,
                assistantDescription,
                setAssistantDescription,
              }}
            />
          )}
          <div className="chatAiMessengerHeader">
            <AiChatHeader
              {...{
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
              }}
            />
          </div>
          <div
            className="chatAiMessengerTop"
            id={typing ? "dataTypingAnswer" : null}
          >
            <div className="chatAiMessengerMessages">
              {messages.map((msg, i) => (
                <div key={i + new Date()}>
                  <AiMessage
                    id={msg?.id}
                    model={
                      modelBasename ? `${modelBasename} : ${modelSize}` : model
                    }
                    message={
                      <Markdown>
                        {msg.content.replace("<think>", "🧠")}
                      </Markdown>
                    }
                    reasoning={<Markdown>{msg.reasoning}</Markdown>}
                    own={msg.role === "user"}
                    // system={msg.role === "control" || msg.role === "system"}
                    system={
                      msg.role !== "user" && msg.role !== "assistant"
                        ? true
                        : false
                    }
                    // length={msg.lengthReasoning}
                    length={msg.reasoning?.length}
                    file={msg.images}
                    setFile={setFile}
                    voices={voices}
                    setVoices={setVoices}
                    selectedVoice={selectedVoice}
                    setSelectedVoice={setSelectedVoice}
                    setShowVoicesChoice={setShowVoicesChoice}
                    speed={msg.speed}
                    dateTime={msg.dateTime}
                    dialogModel={msg.dialogModel}
                    setShowUser={setShowUser}
                    userAvatar={userAvatar}
                    setShowAssistant={setShowAssistant}
                    assistantAvatar={assistantAvatar}
                  />
                </div>
              ))}
              {stopStream && (
                <div className="chatAiMessengerInterrupted">
                  {" "}
                  <WarningAmber
                    style={{ color: "var(--orange)", fontSize: "2rem" }}
                  />
                  <p className="chatAiMessengerInterruptedMessage">
                    You have interrupted the assistant's response. <br />{" "}
                    <span>Please change or repeat your question.</span>
                  </p>
                </div>
              )}
              {connection && (
                <div className="chatAiMessengerTyping">
                  <img
                    className="chatAiMessengerAvatarImg"
                    src={
                      assistantAvatar ? assistantAvatar : "icons/avatarAi.png"
                    }
                    alt="AI_avatar"
                    onClick={() => setShowAssistant(true)}
                  />
                  <div className="chatAiMessengerTypingPreloader">
                    <div className="chatAiMessengerTypingPreloaderContent">
                      <p
                        className="messageUsername"
                        style={{ color: "var(--gray)" }}
                      >
                        {model}
                      </p>
                      <div className="messageTextPreloaderInterrupt">
                        <SpeakerNotesOff
                          style={{
                            color: "var(--gray)",
                            fontSize: "1rem",
                          }}
                          onClick={interruptAssistant}
                        />
                      </div>
                    </div>
                    <div className="messageTextPreloader">
                      <div className="messageTextPreloaderConnection">
                        {/* <Rings
                          visible={true}
                          height="25"
                          width="25"
                          color="green"
                          ariaLabel="rings-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        /> */}
                        <Ripple />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {typing && (
                <div className="chatAiMessengerTyping">
                  <img
                    className="chatAiMessengerAvatarImg"
                    src={
                      assistantAvatar ? assistantAvatar : "icons/avatarAi.png"
                    }
                    alt="AI_avatar"
                    onClick={() => setShowAssistant(true)}
                  />
                  <div className="chatAiMessengerTypingPreloader">
                    <p
                      className="messageUsername"
                      style={{ color: "var(--gray)" }}
                    >
                      {model}
                    </p>
                    {thinking ? (
                      <>
                        <AiMessageThinking
                          {...{ reasoning, interruptAssistant }}
                        />
                      </>
                    ) : (
                      <>
                        <AiMessagePreloader
                          {...{ answer, interruptAssistant }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="chatAiMessengerScroll" ref={scrollRef}>
                {streamError && (
                  <div
                    className="chatAiMessengerError"
                    onClick={
                      errorMessage.includes("Pull the model")
                        ? () => setShowUpdateModel(true)
                        : () => window.location.reload()
                    }
                  >
                    <div className="chatAiMessengerInterrupted">
                      {" "}
                      <WarningAmber
                        style={{ color: "var(--orange)", fontSize: "2rem" }}
                      />
                      <p className="chatAiMessengerInterruptedMessage">
                        Something must have gone wrong. <br />{" "}
                        <span style={{ color: "var(--red)" }}>
                          {errorMessage}
                        </span>
                        <br />{" "}
                        {errorMessage.includes("Pull the model") && (
                          <Button
                            style={{
                              color: "var(--green)",
                              margin: "5px auto",
                            }}
                            onClick={() => setShowUpdateModel(true)}
                            name={"Update the model"}
                          />
                        )}
                      </p>
                    </div>
                    <SickOutlined
                      className="iconTransformScale"
                      style={{ color: "var(--red)", fontSize: "3rem" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Token Count:</strong> {tokenCount}
            </p>
          </div> */}
          <AiMessageInput
            {...{
              enabled,
              sendMessage,
              file,
              setFile,
              newMessage,
              setNewMessage,
              multimodalModel,
              startOrContinueDialog,
              setFileBase64,
              typing,
              thinking,
              connection,
              response,
              interruptAssistant,
              tokenCount,
              setTokenCount,
              totalContext,
              setStopStream,
              userContext,
              setUserContext,
              multimodalModelVision,
              setMultimodalModelVision,
              multimodalModelTools,
              setMultimodalModelTools,
            }}
          />
          {enabled && (
            <>
              <div
                className={`chatAiMessengerCenterExtendedLeft ${
                  extendedToLeft ? "" : "extended"
                }`}
                onClick={() => {
                  setExtendedToLeft(!extendedToLeft);
                }}
              >
                <NavigateNext
                  className={`chatAiMessengerCenterExtendedIconLeft ${
                    extendedToLeft ? "" : "extended"
                  } iconTransformScale`}
                />
              </div>
              {!response && (
                <div
                  className={`chatAiMessengerCenterExtendedRight ${
                    extendedToRight ? "extended" : ""
                  } `}
                  onClick={() => {
                    setExtendedToRight(!extendedToRight);
                  }}
                >
                  <NavigateNext
                    className={`chatAiMessengerCenterExtendedIconRight ${
                      extendedToRight ? "extended" : ""
                    } iconTransformScale`}
                  />
                </div>
              )}
            </>
          )}
        </>
      </div>
      <>
        <div
          className={`chatAiMessengerRight ${
            extendedToRight ? "extended" : ""
          }  ${enabled && !response ? "" : "hide"}`}
        >
          <div
            className={`chatAiMessengerRightIconExtended ${
              extendedToRight ? "extended" : ""
            }`}
            onClick={() => {
              setExtendedToRight(!extendedToRight);
            }}
          >
            <Close
              className={`chatAiMessengerCenterExtendedIconRight ${
                extendedToRight ? "extended" : ""
              } iconTransformScale`}
              style={{ fontSize: "2rem" }}
            />
          </div>
          <AiRightBar
            {...{
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
              multimodalModel,
              setShowIndexedDB,
            }}
          />
        </div>

        <div
          className={`chatAiMessengerRightExtended ${
            extendedToRight ? "extended" : ""
          }`}
          onClick={() => {
            setExtendedToRight(!extendedToRight);
          }}
        >
          {enabled && !response && (
            <h3
              className="chatAiMessengerContainerHeaderTitle2"
              style={{ writingMode: "vertical-lr", cursor: "pointer" }}
            >
              Saved dialogues with all models
            </h3>
          )}
        </div>
      </>
    </div>
  );
}
