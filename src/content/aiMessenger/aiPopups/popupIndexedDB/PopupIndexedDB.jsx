import React, { useRef, useMemo, useState, useEffect } from "react";
import "./popupIndexedDB.css";
import "../../aiUiKit/button/aiUiKitButton.css";
import Input from "../../aiUiKit/input/Input";
import {
  Close,
  CodeOutlined,
  Delete,
  DeleteOutlined,
  Download,
  PrintOutlined,
  Upload,
} from "@mui/icons-material";
import Button from "../../aiUiKit/button/Button";
import Markdown from "markdown-to-jsx";

export default function PopupIndexedDB(props) {
  const { setShowIndexedDB, modelList } = props;
  const [dialogues, setDialogues] = useState([]);
  const [dbVersion, setDbVersion] = useState("—");
  const [filter, setFilter] = useState("");
  const [popupData, setPopupData] = useState(null);
  const installedModels = modelList.map((model) => model.name);
  const [showFormattedText, setShowFormattedText] = useState(false);

  // Відкриття бази даних IndexedDB (створює store "dialogues" при необхідності)
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("AI_Dialogues_DB", 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Якщо store ще не існує — створюємо його
        if (!db.objectStoreNames.contains("dialogues")) {
          db.createObjectStore("dialogues", { keyPath: "initId" });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Допоміжна функція для транзакцій
  const tx = (db, storeName, mode = "readonly") => {
    return db.transaction(storeName, mode).objectStore(storeName);
  };

  // Отримати всі записи зі store
  const getAll = (store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  };

  // Видалити всю базу даних
  const deleteDB = () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("AI_Dialogues_DB");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  };

  // Завантажити JSON у файл
  const download = (filename, text) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([text], { type: "application/json" })
    );
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Імпорт JSON-файлу у IndexedDB
  const importJSON = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      // Очікуємо структуру { dialogues: [...] }
      if (!json.dialogues || !Array.isArray(json.dialogues)) {
        alert("Invalid JSON format: must contain { dialogues: [...] }");
        return;
      }
      const db = await openDB();
      const store = tx(db, "dialogues", "readwrite");
      // Додаємо/оновлюємо всі записи
      json.dialogues.forEach((d) => store.put(d));
      alert("Import successful!");
      loadAll();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Import failed: " + err.message);
    }
  };

  // Завантажити всі діалоги з IndexedDB
  const loadAll = async () => {
    const db = await openDB();
    setDbVersion(db.version);
    const allDialogues = await getAll(tx(db, "dialogues"));
    // Фільтр за modelName
    let filtered = filter
      ? allDialogues.filter((d) =>
          (d.modelName || "").includes(filter.replace(/\//g, "+"))
        )
      : allDialogues;
    // Сортування за часом (initId — timestamp)
    filtered.sort((a, b) => Number(b.initId) - Number(a.initId));
    setDialogues(filtered);
  };

  const deleteDialogue = async (initId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dialog?"
    );
    if (!confirmed) {
      console.log("Dialog deletion cancelled");
      return;
    }
    const db = await openDB();
    const store = tx(db, "dialogues", "readwrite");
    store.delete(initId); // 🔹 Видаляємо конкретний діалог
    setTimeout(loadAll, 150);
    setPopupData(null);
  };

  // Автоматичне завантаження при зміні фільтра
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  //--- JSON Formatter ---
  const formatJSON = (data) => {
    return JSON.stringify(
      data,
      (key, value) => {
        if (key === "images") {
          // Handle case where images can be array or object
          if (Array.isArray(value)) {
            // Keep only non-empty base64 strings
            const validImages = value.filter((v) => v && v.length);
            // console.log("validImages", validImages);
            const count = validImages.length;
            // let num = 0;
            // console.log("count", count);
            // if(count > 0){num=num+1}
            // console.log("num", num);
            return count ? `[👆(click miniature to view)👆]` : "[]";
          }
        }
        return value;
      },
      2
    ).replace(/(.{80})(?!\n)/g, "$1\n"); // wrap long lines for print readability
  };

  const printDialogue = (dialogue) => {
    if (!dialogue) {
      console.error("printDialogue: dialogue is null or undefined");
      return;
    }

    let printWindow;
    try {
      printWindow = window.open("", "_blank"); // 🔹 Відкриття нового вікна для друку
    } catch (error) {
      console.error("printDialogue: failed to open print window", error);
      return;
    }

    const formattedJSON = formatJSON(dialogue);

    if (!printWindow || !printWindow.document) {
      console.error("printDialogue: failed to open print window");
      return;
    }

    try {
      printWindow.document.write(`
       <html>
        <head>
          <title>Dialogue Print</title>
          <style>
            /* 🔹 Inline copy of your CSS for safety */
            .popupIndexedDBViewPreviewHeader { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; width: 100%; gap: 10px; border-bottom: 1px solid var(--text); padding-bottom: 15px; }
            .popupIndexedDBViewPreviewFooter { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; width: 100%; gap: 10px; border-top: 1px solid var(--text); padding-top: 15px; margin-top: 15px; }
            .popupIndexedDBViewPreviewTitle { text-align: center; font-size: 1.2rem; font-weight: 500; line-height: 1.3; color: var(--green); margin-top: 15px; }
            .popupIndexedDBViewPreviewSystemTitle { text-align: center; font-size: 1.2rem; font-weight: 500; line-height: 1.3; color: var(--green); margin-top: 15px; }
            .popupIndexedDBViewPreviewImage { width: 100px; height: 65px; object-fit: cover; cursor: pointer; border-radius: 10px; box-shadow: 0px 0px 7px 5px var(--bg); }
            .popupIndexedDBViewPreviewSystem { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; gap: 10px; border: 1px solid var(--text); border-radius: 15px; padding: 10px; margin: 0 auto; }
            .popupIndexedDBViewPreviewSystemHeader { display: flex; align-items: center; justify-content: center; width: 100%; gap: 10px; text-transform: uppercase; }
            .popupIndexedDBViewPreviewUser { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; width: 95%; gap: 10px; border: 1px solid var(--text); border-radius: 15px; border-bottom-right-radius: 0px; padding: 10px; margin-left: auto; }
            .popupIndexedDBViewPreviewUserHeader { display: flex; align-items: center; justify-content: flex-end; width: 100%; gap: 10px; text-transform: capitalize; }
            .popupIndexedDBViewPreviewRole span { text-transform: uppercase; color: var(--text); font-weight: 700; }
            .popupIndexedDBViewPreviewAssistant { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; width: 95%; gap: 10px; border: 1px solid var(--text); border-radius: 15px; border-bottom-left-radius: 0px; padding: 10px; margin-right: auto; }
            .popupIndexedDBViewPreviewAssistantHeader { display: flex; align-items: center; justify-content: flex-start; width: 100%; gap: 10px; text-transform: capitalize; }
            .popupIndexedDBViewPreviewContent { display: flex; flex-direction: column; justify-content: center; width: 100%; gap: 10px; color: var(--text); white-space: pre-wrap; text-align: justify; }
            .popupIndexedDBViewPreviewContent.popupIndexedDBViewPreviewContentReasoning { align-items: flex-start; color: var(--gray); font-style: italic; border-bottom: 2px dashed var(--gray); padding-bottom: 10px; margin-bottom: 15px; }
            .popupIndexedDBViewPreviewContent.popupIndexedDBViewPreviewContentUser { align-items: flex-end; }
            .popupIndexedDBViewPreviewContent.popupIndexedDBViewPreviewContentAssistant { align-items: flex-start; }
          </style>
        </head>
        <body>
          <pre>
<div class="popupIndexedDBViewPreviewHeader">
  <p>Id: ${dialogue.initId}</p>
  <p class="popupIndexedDBViewPreviewRole">Model: <span>${
    dialogue.modelName
  }</span></p>
  <p>Title: ${dialogue.dialogueTitle}</p>
</div>
${dialogue.messages
  ?.map((msg, i) => {
    if (!msg) return "";
    if (msg.role === "system") {
      return `
<div class="popupIndexedDBViewPreviewSystem">
  <div class="popupIndexedDBViewPreviewSystemHeader">
    <p class="popupIndexedDBViewPreviewRole">Role: <span>${msg.role}</span></p>
  </div>
  <p>System prompt</p>
  <div class="popupIndexedDBViewPreviewContent">${msg.content || ""}</div>
</div>`;
    }
    if (msg.role === "user") {
      const images = Array.isArray(msg.images)
        ? msg.images
            .map(
              (img, j) =>
                `<img class="popupIndexedDBViewPreviewImage" src="data:image/jpeg;base64,${img}" alt="user-img-${j}"/>`
            )
            .join("")
        : "";
      return `
<div class="popupIndexedDBViewPreviewUser">
  <div class="popupIndexedDBViewPreviewUserHeader">
    <p class="popupIndexedDBViewPreviewRole">Role: <span>${msg.role}</span></p>
    <p>Id msg.: ${msg.id || ""}</p>
  </div>
  <p>🖋Message🖋</p>
  ${images}
  <div class="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentUser">${
    msg.content || ""
  }</div>
</div>`;
    }
    if (msg.role === "assistant") {
      return `
<div class="popupIndexedDBViewPreviewAssistant">
  <div class="popupIndexedDBViewPreviewAssistantHeader">
    <p>Id msg.: ${msg.id || ""}</p>
    <p class="popupIndexedDBViewPreviewRole">Role: <span>${msg.role}</span></p>
  </div>
  ${
    msg.reasoning
      ? `<p>🧠Reasoning🧠</p><div class="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentReasoning">${msg.reasoning}</div>`
      : ""
  }
  <p>🖊Answer🖊</p>
  <div class="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentAssistant">${
    msg.content || ""
  }</div>
  <div class="popupIndexedDBViewPreviewAssistantHeader">
    ${
      msg.dialogModel
        ? `<p class="popupIndexedDBViewPreviewRole">Model: <span>${msg.dialogModel}</span></p>`
        : ""
    }
    ${msg.dateTime ? `<p>Date time: ${msg.dateTime}</p>` : ""}
    ${msg.speed ? `<p>Speed: ${msg.speed} tokens</p>` : ""}
  </div>
</div>`;
    }
    return "";
  })
  .join("\n")}
<div class="popupIndexedDBViewPreviewFooter">
  <p>Id: ${dialogue.initId}</p>
  <p class="popupIndexedDBViewPreviewRole">Model: <span>${
    dialogue.modelName
  }</span></p>
  <p>Title: ${dialogue.dialogueTitle}</p>
</div>
          </pre>
        </body>
      </html>
      `);
    } catch (error) {
      console.error("printDialogue: failed to write html", error);
    }

    try {
      printWindow.document.close();
    } catch (error) {
      console.error("printDialogue: failed to close document", error);
    }

    try {
      printWindow.print();
    } catch (error) {
      console.error("printDialogue: failed to print", error);
    }
  };

  const renderDialogueDetails = (dialogue) => {
    return (
      <div>
        {/* Check if messages contain images */}
        {Array.isArray(dialogue.messages) && dialogue.messages.length > 0 && (
          <div
            className="innerPopupImageBox"
            style={
              dialogue.messages.some(
                (m) => Array.isArray(m.images) && m.images.length > 0
              )
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            {dialogue.messages
              .filter((m) => Array.isArray(m.images) && m.images.length > 0)
              .flatMap((m) => m.images)
              .map(
                (img, i) =>
                  img && (
                    <img
                      key={i}
                      src={`data:image/jpeg;base64,${img}`}
                      alt={`dialogue-img-${i}`}
                      className="innerPopupImage"
                      // onClick={() =>
                      //   window.open(`data:image/jpeg;base64,${img}`, "_blank")
                      // }
                    />
                  )
              )}
          </div>
        )}
        <pre style={{ height: "250px", width: "95%" }}>
          {formatJSON(dialogue)}
        </pre>
      </div>
    );
  };

  console.log("popupData", popupData);

  return (
    <div className="popupIndexedDB">
      <div className="popupIndexedDBContainer">
        <div className="popupIndexedDBHeader">
          <h3 className="popupIndexedDBHeaderTitle">
            OllamaEase database Viewer
          </h3>
          <Close
            className="popupIndexedDBHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowIndexedDB(false);
            }}
          />
        </div>
        <div className="popupIndexedDBBody">
          {/* Інформація про базу даних */}
          <div className="popupIndexedDBBodyItem">
            <div className="popupIndexedDBBodyItemHeader">
              <div>
                <div className="text-sm text-gray-400">Database</div>
                <div>
                  <strong>Name:</strong> AI_Dialogues_DB
                </div>
                <div className="text-sm text-gray-400">
                  Version: {dbVersion}
                </div>
              </div>

              {/* Фільтр */}
              <div className="flex-1">
                <div className="text-sm text-gray-400">Filter</div>
                <div className="popupIndexedDBBodyItemHeader">
                  <Input
                    type="text"
                    placeholder="Filter by model…"
                    value={filter}
                    onChangeR={(e) => setFilter(e.target.value)}
                  />
                  <Button
                    onClick={() => setFilter("")}
                    className="popupIndexedDBButton"
                    name={"Clear"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Вивід діалогів */}
          <div className="popupIndexedDBBodyItem">
            <section className="popupIndexedDBBodyItemValue">
              <h2 className="popupIndexedDBBodyTitle">
                Store: dialogues <span>{dialogues.length}</span>
              </h2>
              {!dialogues.length ? (
                <div className="text-gray-400">No dialogues found.</div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#223042]">
                      <th className="text-left p-2">Id</th>
                      <th className="text-left p-2">modelName</th>
                      <th className="text-left p-2">🔳</th>{" "}
                      {/* 🔹 Нова колонка */}
                      <th className="text-left p-2">dialogueTitle</th>
                      <th className="text-left p-2">💬</th>
                      <th className="text-left p-2">data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dialogues.map((d) => (
                      <>
                        <tr
                          key={d.initId}
                          className="border-b border-[#223042]"
                        >
                          <td className="p-2">{d.initId}</td>
                          <td className="p-2">{d.modelName}</td>
                          <td className="p-2">
                            {" "}
                            {/* 🔹 Індикатор */}
                            {installedModels.includes(d.modelName)
                              ? "✅"
                              : "🔳"}
                          </td>
                          <td className="p-2">{d.dialogueTitle}</td>
                          <td className="p-2">
                            {Array.isArray(d.messages) ? d.messages.length : 0}
                          </td>

                          <td className="p-2">
                            <Button
                              onClick={() => setPopupData(d)}
                              className="popupIndexedDBButton"
                              name={"View"}
                            />
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Вивід у форматі JSON */}
            <div className="popupIndexedDBBodyItemValue">
              <details close>
                <summary
                  className="popupIndexedDBButtonLabel"
                  style={{ marginTop: "15px" }}
                >
                  Show/Hide OllamaEase DB (JSON)
                </summary>
                <pre>
                  {/* {JSON.stringify({ dialogues }, null, 2)} */}
                  {formatJSON({ dialogues })}
                </pre>
              </details>
            </div>
          </div>
          {/* 🔹 Попап для відображення JSON */}
          {popupData && (
            <div className="popupIndexedDBView">
              <div className="popupIndexedDBBodyItemValue">
                <h3 className="popupIndexedDBBodyTitle">
                  Dialogue <span>"{popupData.dialogueTitle}"</span> Details
                </h3>
                {/* <pre style={{ height: "300px", width: "95%" }}> */}
                {/* {formatJSON(popupData)} */}
                {!showFormattedText && <>{renderDialogueDetails(popupData)}</>}
                {/* </pre> */}
                {showFormattedText && (
                  <pre style={{ height: "300px", width: "95%" }}>
                    <div className="popupIndexedDBViewPreviewHeader">
                      <p>Id: {popupData.initId}</p>
                      <p className="popupIndexedDBViewPreviewRole">
                        Model: <span>{popupData.modelName}</span>
                      </p>
                      <p>Title: {popupData.dialogueTitle}</p>
                    </div>
                    {popupData?.messages?.map((msg, i) => {
                      if (!msg) return null;
                      return (
                        <div key={i + new Date()}>
                          {msg.role === "system" && (
                            <div className="popupIndexedDBViewPreviewSystem">
                              {" "}
                              <div className="popupIndexedDBViewPreviewSystemHeader">
                                <p className="popupIndexedDBViewPreviewRole">
                                  Role: <span>{msg.role}</span>
                                </p>
                              </div>
                              <p>System prompt</p>
                              <div className="popupIndexedDBViewPreviewContent">
                                <p>{msg.content}</p>
                              </div>
                            </div>
                          )}
                          {msg.role === "user" && (
                            <div className="popupIndexedDBViewPreviewUser">
                              {" "}
                              <div className="popupIndexedDBViewPreviewUserHeader">
                                <p className="popupIndexedDBViewPreviewRole">
                                  Role: <span>{msg.role}</span>
                                </p>
                                <p>Id msg.: {msg.id}</p>
                              </div>
                              <p>🖋Message🖋</p>
                              {msg.images?.length > 0 && (
                                <img
                                  className="popupIndexedDBViewPreviewImage"
                                  src={`data:image/jpeg;base64,${msg.images}`}
                                  alt="image"
                                />
                              )}
                              <div className="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentUser">
                                <p>{msg.content}</p>
                              </div>
                            </div>
                          )}
                          {msg.role === "assistant" && (
                            <div className="popupIndexedDBViewPreviewAssistant">
                              {" "}
                              <div className="popupIndexedDBViewPreviewAssistantHeader">
                                <p>Id msg.: {msg.id}</p>
                                <p className="popupIndexedDBViewPreviewRole">
                                  Role: <span>{msg.role}</span>
                                </p>
                              </div>
                              {msg.reasoning && (
                                <>
                                  <p>🧠Reasoning🧠</p>
                                  <div className="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentReasoning">
                                    <Markdown>{msg.reasoning}</Markdown>
                                  </div>
                                </>
                              )}
                              <p>🖊Answer🖊</p>
                              <div className="popupIndexedDBViewPreviewContent popupIndexedDBViewPreviewContentAssistant">
                                <Markdown>{msg.content}</Markdown>
                              </div>
                              <div className="popupIndexedDBViewPreviewAssistantHeader">
                                {msg?.dialogModel && (
                                  <p className="popupIndexedDBViewPreviewRole">
                                    Model: <span>{msg?.dialogModel}</span>
                                  </p>
                                )}
                                {msg?.dateTime && (
                                  <p>Date time: {msg?.dateTime}</p>
                                )}
                                {msg?.speed && <p>Speed: {msg?.speed}tokens</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="popupIndexedDBViewPreviewFooter">
                      <p>Id: {popupData.initId}</p>
                      <p className="popupIndexedDBViewPreviewRole">
                        Model: <span>{popupData.modelName}</span>
                      </p>
                      <p>Title: {popupData.dialogueTitle}</p>
                    </div>
                  </pre>
                )}
                <div className="innerPopupBtn">
                  <Button
                    onClick={() => {
                      setPopupData(null);
                      setShowFormattedText(false);
                    }}
                    className="popupIndexedDBButton"
                    style={{ color: "green" }}
                    icon={<Close />}
                    name={"Close details"}
                  />
                  <Button
                    onClick={() => setShowFormattedText(!showFormattedText)}
                    className="popupIndexedDBButton"
                    icon={<CodeOutlined />}
                    name={
                      showFormattedText
                        ? "Hide formatted text"
                        : "Show formatted text"
                    }
                  />+
                  {!showFormattedText && (
                    <Button
                      onClick={() => printDialogue(popupData)}
                      className="popupIndexedDBButton"
                      icon={<PrintOutlined />}
                      name={"Print"}
                    />
                  )}
                  <Button
                    onClick={() => deleteDialogue(popupData.initId)}
                    className="popupIndexedDBButton"
                    style={{ color: "red" }}
                    icon={<DeleteOutlined />}
                    name={"Delete"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="popupIndexedDBButtons">
          <Button
            className="popupIndexedDBButton"
            onClick={() => {
              setShowIndexedDB(false);
            }}
            name={"Close"}
          />
          {/* Кнопка оновлення */}
          {/* <Button
            onClick={loadAll}
            className="popupIndexedDBButton"
            name={"Refresh"}
          /> */}

          {/* Кнопка експорту */}
          <Button
            onClick={async () => {
              const db = await openDB();
              const allDialogues = await getAll(tx(db, "dialogues"));
              download(
                `AI_Dialogues_DB_${new Date().toISOString()}.json`,
                JSON.stringify({ dialogues: allDialogues }, null, 2)
              );
            }}
            className="popupIndexedDBButton"
            icon={<Download />}
            name={"Export DB (JSON)"}
          />

          {/* Імпорт JSON */}
          <label className="popupIndexedDBButtonLabel">
            <Upload />
            Import DB (JSON)
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files?.[0] && importJSON(e.target.files[0])
              }
            />
          </label>

          {/* Видалення всієї БД */}
          <Button
            onClick={async () => {
              if (
                !window.confirm(
                  "Delete the entire AI_Dialogues_DB? This cannot be undone."
                )
              )
                return;
              await deleteDB();
              setTimeout(loadAll, 150);
            }}
            className="popupIndexedDBButton"
            style={{ color: "red" }}
            icon={<Delete />}
            name={"Delete DB"}
          />
        </div>
      </div>
    </div>
  );
}
