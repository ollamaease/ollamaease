import React, { useRef, useMemo, useState, useEffect } from "react";
import "./popupInfoModel.css";
import { Close } from "@mui/icons-material";
import Button from "../../aiUiKit/button/Button";

export default function PopupInfoModel(props) {
  const { setShowInfo, modelInfo } = props;
  const info = modelInfo;
  const [openKey, setOpenKey] = useState(() => {
    const keys = Object.keys(info || {});
    return keys.includes("modified_at")
      ? "modified_at"
      : keys[keys.length - 1] || null;
  });

  const keyRefs = useRef({}); // holds refs for each key

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

  return (
    <div className="popupInfoModel">
      <div className="popupInfoModelContainer">
        <div className="popupInfoModelHeader">
          <h3 className="popupInfoModelHeaderTitle">Info Model</h3>
          <Close
            className="popupInfoModelHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowInfo(false);
            }}
          />
        </div>
        <div className="popupInfoModelBody">
          {modelInfo && info
            ? Object.entries(info).map(([key, value]) => {
                if (typeof value === "undefined" || value === null) return null;
                if (key === "tensors") {
                  return null;
                }
                return (
                  <div
                    key={key}
                    className="popupInfoModelBodyItem"
                    ref={(el) => {
                      if (openKey === key) keyRefs.current[key] = el;
                    }}
                  >
                    <Button
                      onClick={() => toggleKey(key)}
                      style={{
                        cursor: "pointer",
                        fontWeight: openKey === key ? "bold" : "normal",
                        color: openKey === key ? "var(--green)" : "var(--gray)",
                      }}
                      name={key}
                    />
                    {openKey === key && (
                      <div className="popupInfoModelBodyItemValue">
                        <br />
                        {typeof value === "string" ? (
                          key === "modified_at" ? (
                            <div className="popupInfoModelBodyModifiedAt">
                              {new Date(value).toLocaleString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </div>
                          ) : (
                            value.split("\n").map((line, idx) => (
                              <span key={idx}>
                                {line}
                                <br />
                              </span>
                            ))
                          )
                        ) : Array.isArray(value) ? (
                          <ul>
                            {value.map((item, idx) =>
                              Array.isArray(item) ? (
                                <li key={idx}>
                                  <ul>
                                    {item.map((i, subIdx) => (
                                      <li key={subIdx}>{i}</li>
                                    ))}
                                  </ul>
                                </li>
                              ) : (
                                <li key={idx}>{item}</li>
                              )
                            )}
                          </ul>
                        ) : typeof value === "object" ? (
                          Object.entries(value).map(
                            ([childKey, childValue]) => {
                              if (childValue === "" || childValue === undefined)
                                return null;
                              return (
                                <div key={childKey}>
                                  <strong style={{ color: "var(--gray)" }}>
                                    {childKey}:
                                  </strong>{" "}
                                  {typeof childValue === "string" ? (
                                    childValue.split("\n").map((line, idx) => (
                                      <span
                                        key={idx}
                                        style={{ color: "var(--green)" }}
                                      >
                                        {line}
                                        <br />
                                      </span>
                                    ))
                                  ) : typeof childValue === "object" &&
                                    childValue !== null ? (
                                    <span style={{ color: "var(--green)" }}>
                                      {JSON.stringify(childValue)}
                                    </span>
                                  ) : (
                                    <span style={{ color: "var(--green)" }}>
                                      {String(childValue)}
                                    </span>
                                  )}
                                </div>
                              );
                            }
                          )
                        ) : (
                          <span style={{ color: "red" }}>
                            Unsupported data type for {key}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            : null}
        </div>
        <div className="popupInfoModelButtons">
          <Button
            className="popupInfoModelButton"
            onClick={() => {
              setShowInfo(false);
            }}
            name={"Close"}
          />
        </div>
      </div>
    </div>
  );
}
