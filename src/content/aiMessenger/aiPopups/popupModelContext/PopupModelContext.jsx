import React, { useEffect, useState } from "react";
import "./popupModelContext.css";
import Button from "../../aiUiKit/button/Button";
import Input from "../../aiUiKit/input/Input";
import { Close, LockOpen, LockOutline } from "@mui/icons-material";

export default function PopupModelContext(props) {
  const {
    fullCapacityContext,
    setModelContext,
    setShowModelContext,
    getAutoNumCtx,
    lockModelContext,
    setLockModelContext,
  } = props;
  const reportedMemory = navigator.deviceMemory ?? 4;
  const [manualMemory, setManualMemory] = useState(null);
  const effectiveMemory = manualMemory ?? reportedMemory;

  const [numCtx, setNumCtx] = useState(() => getAutoNumCtx(effectiveMemory));
  const [warning, setWarning] = useState("");
  const [savedCtx, setSavedCtx] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(
      ["num_ctx", "manual_memory", "lock_model_context"],
      (result) => {
        const mem = result.manual_memory ?? null;
        if (mem) setManualMemory(mem);

        const baseMemory = mem ?? reportedMemory;
        const saved = result.num_ctx ?? getAutoNumCtx(baseMemory);
        setNumCtx(saved);
        setSavedCtx(saved);
        updateWarning(saved, baseMemory);
        setLockModelContext(result.lock_model_context ?? false);
      }
    );
  }, []);

  const updateWarning = (value, memory) => {
    // if (value > 8192 && memory < 32) {
    //   setWarning(
    //     `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
    //   );
    // } else if (value > 4096 && memory < 16) {
    //   setWarning(
    //     `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
    //   );
    // } else if (value > 3072 && memory < 8) {
    //   setWarning(`⚠️ High context may slow down or crash low-memory devices.`);
    // } else {
    //   setWarning("");
    // }
    if (value > 31744 && memory < 64) {
      setWarning(
        `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
      );
    } else if (value > 24576 && memory < 50) {
      setWarning(
        `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
      );
    } else if (value > 16384 && memory < 34) {
      setWarning(
        `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
      );
    } else if (value > 8192 && memory < 18) {
      setWarning(
        `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
      );
    } else if (value > 4096 && memory < 10) {
      setWarning(
        `⚠️ ${value} tokens may crash your system with only ${memory} GB RAM.`
      );
    } else if (value > 3072 && memory < 8) {
      setWarning(`⚠️ High context may slow down or crash low-memory devices.`);
    } else {
      setWarning("");
    }
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumCtx(value);
    updateWarning(value, effectiveMemory);
  };

  const handleSave = () => {
    chrome.storage.local.set(
      {
        num_ctx: numCtx,
        ...(manualMemory ? { manual_memory: manualMemory } : {}),
      },
      () => {
        // alert(`Saved num_ctx: ${numCtx}`);
        setSavedCtx(numCtx);
      }
    );
    setModelContext(numCtx);
    setShowModelContext(false);
    if (lockModelContext) {
      chrome.storage.local.set({ lock_model_context: true });
    } else {
      chrome.storage.local.set({ lock_model_context: false });
    }
  };

  const handleLockModelContext = () => {
    setLockModelContext(true);
  };
  const handleUnlockModelContext = () => {
    setLockModelContext(false);
  };

  const handleReset = () => {
    const auto = getAutoNumCtx(effectiveMemory);
    setNumCtx(auto);
    updateWarning(auto, effectiveMemory);
  };

  const handleManualMemoryChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setManualMemory(value);
      updateWarning(numCtx, value);
    } else {
      setManualMemory(null);
      updateWarning(numCtx, reportedMemory);
    }
  };

  //   const getRangeBackground = (value) => {
  //   return `linear-gradient(to right, var(--green) ${value}%, var(--bg) ${value}%)`;
  // };
  const getRangeBackground = (value) => {
    return `linear-gradient(to right, var(--green) 0%, var(--green) ${value}%, var(--bg) ${value}%, var(--bg) 100%)`;
  };

  return (
    <div className="popupModelContext">
      <div className="popupModelContextContainer">
        <div className="popupModelContextHeader">
          <h3 className="popupModelContextHeaderTitle">🧠 Context Settings</h3>
          <Close
            className="popupModelContextHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowModelContext(false);
            }}
          />
        </div>
        <div className="popupModelContextBody">
          <div className="popupModelContextBodyBlock">
            <strong className="popupModelContextBodyBlockTitle">
              Detected RAM: <span>{reportedMemory}</span> GB
            </strong>
            {reportedMemory < 16 && (
              <div
                className="popupModelContextBodyBlockText"
                style={{ margin: "0 auto" }}
              >
                (May be underestimated due to browser limits)
              </div>
            )}
          </div>

          <label className="popupModelContextBodyBlockLabel">
            <p className="popupModelContextBodyBlockTitle"> Override RAM:</p>
            <Input
              className={"popupModelContextBodyBlockInput"}
              type="text"
              placeholder="e.g. 16"
              value={Number(manualMemory) ?? ""}
              onChangeR={handleManualMemoryChange}
            />
            <p className="popupModelContextBodyBlockTitle"> GB</p>
          </label>

          <div className="popupModelContextBodyBlock">
            <label
              className="popupModelContextBodyBlockLabel"
              htmlFor="ctxSlider"
              style={{ justifyContent: "space-between" }}
            >
              Context Length: <strong>{numCtx}</strong> tokens{" "}
              {lockModelContext ? (
                <LockOutline style={{ color: "var(--green)" }} />
              ) : (
                <LockOpen style={{ color: "var(--red)" }} />
              )}
              <Button
                onClick={
                  lockModelContext
                    ? handleUnlockModelContext
                    : handleLockModelContext
                }
                name={lockModelContext ? "Unlock" : "Lock"}
              />
            </label>
            <Input
              id="ctxSlider"
              className={"popupModelContextBodyBlockInputRange"}
              type="range"
              min="512"
              max={fullCapacityContext ?? "8192"}
              step="512"
              value={numCtx}
              onChangeR={handleSliderChange}
              style={{
                width: "100%",
                marginTop: 8,
                background: getRangeBackground(
                  (numCtx / fullCapacityContext) * 100
                ),
              }}
            />
          </div>
          <div
            className="popupModelContextBodyBlock"
            style={{
              marginTop: 7,
              height: "50px",
              justifyContent: "flex-start",
            }}
          >
            <div className="popupModelContextBodyBlockDescription">
              <p className="popupModelContextBodyBlockText">512</p>
              <p
                className="popupModelContextBodyBlockText"
                style={
                  fullCapacityContext != null &&
                  numCtx != null &&
                  fullCapacityContext < numCtx
                    ? {
                        color: "var(--red)",
                      }
                    : {}
                }
              >
                Max context length:
                {fullCapacityContext ?? "8192"}
              </p>
            </div>
            {savedCtx !== null && savedCtx !== numCtx && (
              <p
                className="popupModelContextBodyBlockText"
                style={{ margin: "auto" }}
              >
                (Previously saved: {savedCtx} tokens)
              </p>
            )}
            {warning !== null && warning !== undefined && (
              <div
                className="popupModelContextWarning"
                style={{
                  color:
                    numCtx > fullCapacityContext / 2 ? "var(--red)" : undefined,
                }}
              >
                {warning}
              </div>
            )}
          </div>

          <div className="popupModelContextBodyBlock">
            <strong className="popupModelContextBodyBlockTitle">
              What is Context Length?
            </strong>
            <p
              className="popupModelContextBodyBlockText"
              style={{ color: "var(--green)", fontSize: "0.8rem" }}
            >
              The context length determines how many tokens (chunks of text) the
              model can “remember” in a single conversation. Higher values
              improve long replies but use significantly more RAM and CPU.
            </p>
          </div>
        </div>
        <div className="popupModelContextButtons">
          <Button onClick={handleSave} name="Save" />
          <Button onClick={handleReset} name="↩ Reset to Recommended" />
        </div>
      </div>
    </div>
  );
}
