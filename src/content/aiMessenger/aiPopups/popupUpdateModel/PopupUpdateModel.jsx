import React, { useEffect, useRef, useState } from "react";
import "./popupUpdateModel.css";
import Button from "../../aiUiKit/button/Button";
import { Cached, Close } from "@mui/icons-material";
import Input from "../../aiUiKit/input/Input";

export default function popupUpdateModel(props) {
  const {
    setShowUpdateModel,
    downloadModel,
    setDownloadModel,
    model,
    chooseModel,
    needUpdateOllama,
    ollamaVer,
    ollamaReleaseVer,
  } = props;
  const handleClose = () => {
    setDownloadModel(false);
    setShowUpdateModel(false);
    // window.location.reload();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(null);
  const [percent, setPercent] = useState(0);
  const [downloadModelName, setDownloadModelName] = useState("");
  const [firstUpdate, setFirstUpdate] = useState(false);

  const [error, setError] = useState(null);
  const [retryCountdown, setRetryCountdown] = useState(null); // 🆕 Countdown before retry

  // console.log("needUpdateOllama 2", needUpdateOllama)
  // console.log("verLocal 2", ollamaVer);
  // console.log("verRelease 2", ollamaReleaseVer);

  useEffect(() => {
    if (ollamaVer < ollamaReleaseVer) {
      setFirstUpdate(true);
    }
  }, [ollamaVer, ollamaReleaseVer]);

  useEffect(() => {
    if (status === "error" && retryCountdown !== null && retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (status === "error" && retryCountdown === 0) {
      updateModel(); // retry
    }
  }, [retryCountdown, status]);

  const updateModel = async () => {
    setIsLoading(true);
    setStatus("starting");
    setPercent(0);
    setError(null);
    setRetryCountdown(null); // 🆕 Clear retry if manual trigger
    setProgress("");
    try {
      const response = await fetch("http://localhost:11434/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: downloadModelName ? downloadModelName : model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      if (!response.body) {
        console.error("No response body");
        setStatus("error");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let received = "";
      setStatus("pulling");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        received += decoder.decode(value, { stream: true });
        const lines = received.split("\n");
        received = lines.pop(); // retain last partial line

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            setProgress(data);

            // Calculate percent if values exist
            if (data.completed && data.total) {
              const p = Math.floor((data.completed / data.total) * 100);
              setPercent(p);
            }

            if (data.status === "success") {
              setStatus("done");
              setPercent(100);
              setTimeout(() => {
                setShowUpdateModel(false);
                setDownloadModel(false);
                chooseModel(downloadModelName ? downloadModelName : model);
              }, 2000);
              return;
            }
          } catch (err) {
            console.warn("Invalid line skipped:", line);
            window.alert("Invalid line skipped: " + line);
          }
        }
      }
      if (percent === 100 && status !== "done") {
        setStatus("done");
      }
    } catch (err) {
      console.error("Update error:", err.message);
      setStatus("error");
      setError("⚠️ Network error. Retrying in 5 seconds...");
      setRetryCountdown(5); // 🆕 Trigger auto-retry countdown
      setProgress("Error");
      setPercent(0);
    }
    setIsLoading(false);
  };

  return (
    <div className="popupUpdateModel">
      <div className="popupUpdateModelContainer">
        <div className="popupUpdateModelHeader">
          <h3 className="popupUpdateModelHeaderTitle">
            {downloadModel ? "Download Model" : "Update Model"}
          </h3>
          {status === "idle" && (
            <Close
              className="popupUpdateModelHeaderClose"
              style={{ fontSize: "2rem", color: "var(--bg)" }}
              onClick={() => {
                handleClose();
              }}
            />
          )}
        </div>
        {firstUpdate ? (
          <div className="popupUpdateModelBody">
            Ollama needs to be updated first. From version {ollamaVer} to
            version {ollamaReleaseVer}. Please update ollama before{" "}
            {downloadModel ? "downloading" : "updating"} models.
            How to update ollama? Check{" "}
            <a
              href="https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-upgrade-ollama"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </div>
        ) : (
          <div className="popupUpdateModelBody">
            {downloadModel ? (
              <>
                <Input
                  style={{ margin: "0 auto", textAlign: "center" }}
                  type="text"
                  placeholder="You can use run Model command..."
                  className="popupUpdateModelBodyInput"
                  maxLength="60"
                  onChangeR={(e) => {
                    try {
                      const value = e.target.value;
                      if (value) {
                        const splitValue = value.split(/run |pull /).pop();
                        setDownloadModelName(splitValue || "");
                      } else {
                        setDownloadModelName("");
                      }
                    } catch (error) {
                      console.error("Error parsing input:", error);
                    }
                  }}
                  disabled={status !== "idle"}
                />
                <h3 className="popupModelContextBodyBlockTitle">
                  {downloadModel && downloadModelName}
                </h3>
              </>
            ) : (
              <h3 className="popupModelContextBodyBlockTitle">{model}</h3>
            )}

            <div className="popupUpdateModelBodyBlock">
              {status !== "idle" && (
                <div className="popupUpdateModelBodyBlock">
                  <p className="popupUpdateModelBodyBlockText">
                    Process: <strong>{status}</strong>
                  </p>
                  {progress?.status && (
                    <p className="popupUpdateModelBodyBlockText">
                      Status:{" "}
                      <strong
                        style={
                          progress.status === "success"
                            ? {
                                color: "var(--green)",
                                textTransform: "uppercase",
                              }
                            : {
                                color: "var(--orange)",
                                textTransform: "lowercase",
                              }
                        }
                      >
                        {progress.status}
                      </strong>
                    </p>
                  )}

                  <div className="popupUpdateModelProgressBarContainer">
                    <div
                      className="popupUpdateModelProgressBar"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* <p className="popupUpdateModelProgressBarText">{percent}%</p> */}
                  <p className="popupUpdateModelProgressBarText">
                    {status === "done"
                      ? `success`
                      : progress?.completed !== undefined &&
                        progress?.total !== undefined &&
                        progress?.total > 0
                      ? `${(
                          (progress.completed / progress.total) *
                          100
                        ).toFixed(2)}%`
                      : "waiting..."}
                  </p>
                </div>
              )}
            </div>
            {status === "idle" && (
              <Button
                style={
                  downloadModel
                    ? downloadModelName
                      ? { margin: "0 auto 10px", display: "flex" }
                      : { margin: "0 auto", display: "none" }
                    : { margin: "0 auto 10px" }
                }
                onClick={updateModel}
                name={downloadModel ? "Download Model" : "Update Model"}
              />
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 font-semibold">
            {error}
            {retryCountdown !== null && (
              <p className="text-sm text-gray-500">
                Retrying in {retryCountdown}s…
              </p>
            )}
          </div>
        )}
        <div className="popupUpdateModelButtons">
          {status !== "done" && (
            <Button
              disabledBtn={isLoading}
              onClick={() => handleClose()}
              name="Close"
            />
          )}
          {status === "done" && (
            <Button
              disabledBtn={isLoading}
              onClick={() => {
                setDownloadModel(false);
                window.location.reload();
              }}
              name="Refresh"
              icon={<Cached color="action" fontSize="small" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
