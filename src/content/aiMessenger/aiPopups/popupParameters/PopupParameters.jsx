import React, { useEffect, useRef, useState } from "react";
import "./popupParameters.css";
import Button from "../../aiUiKit/button/Button";
import { Close } from "@mui/icons-material";
import SettingItemThinking from "../popupSettingsAi/SettingItemThinking";

export default function popupParameters(props) {
  const {
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
  } = props;

  const handleClose = () => {
    setShowParameters(false);
  };

  const handleSave = () => {
    window.confirm("Saved!");
  };

  const handleReset = () => {
    window.confirm("Are you sure you want to reset?");
  };


    const getRangeBackground = (value) => {
    return `linear-gradient(to right, var(--green) ${value}%, var(--bg) ${value}%)`;
  };

  return (
    <div className="popupParameters">
      <div className="popupParametersContainer">
        <div className="popupParametersHeader">
          <h3 className="popupParametersHeaderTitle">Parameters</h3>
          <Close
            className="popupParametersHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowParameters(false);
            }}
          />
        </div>
        <div className="popupParametersBody">
          {Object.entries(parametersModel).map(([key, value]) => {
            return (
              <div className="popupParametersItem">
                <p className="popupParametersItemName">{key}</p>
                <p className="popupParametersItemValue">{value}</p>
              </div>
            );
          })}
          <div className="popupParametersItem">
            <Button className="popupParametersItemBtn" name={"Temperature"}/>  
            <div className="popupSettingsAiItemWrapper">
              <input
                className="popupSettingsAiBodyRange"
                type="range"
                min="0"
                max="2"
                step="0.1"
                name="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                style={{ background: getRangeBackground(temperature * 50) }}
              />
              <p className="popupSettingsAiItemValue">{temperature}</p>
            </div>
            <Close
              className="popupSettingsAiItemDelete"
              onClick={() => setTemperature(0)}
            />
          </div>
          <div className="popupParametersItem">
            <Button className="popupParametersItemBtn" name={"Top P"}/>  
            <div className="popupSettingsAiItemWrapper">
              <input
                className="popupSettingsAiBodyRange"
                type="range"
                min="0"
                max="1"
                step="0.05"
                name="topP"
                value={topP}
                onChange={(e) => setTopP(e.target.value)}
                style={{ background: getRangeBackground(topP * 100) }}
              />
              <p className="popupSettingsAiItemValue">{topP}</p>
            </div>
            <Close
              className="popupSettingsAiItemDelete"
              onClick={() => setTopP(0)}
            />
          </div>
          <div className="popupParametersItem">
            <p className="popupParametersItemBtn">Maximum Length</p>
            <div className="popupSettingsAiItemWrapper">
              <input
                className="popupSettingsAiBodyRange"
                type="range"
                min="0"
                max="1"
                step="0.01"
                name="maxTokens"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                style={{ background: getRangeBackground(maxTokens * 100) }}
              />
              <p className="popupSettingsAiItemValue">{maxTokens * 1000}</p>
            </div>
            <Close
              className="popupSettingsAiItemDelete"
              onClick={() => setMaxTokens(0)}
            />
          </div>
          <div className="popupParametersItem">
            <p className="popupParametersItemBtn">Frequency Penalty</p>
            <div className="popupSettingsAiItemWrapper">
              <input
                className="popupSettingsAiBodyRange"
                type="range"
                min="-2"
                max="2"
                step="0.1"
                name="frequencyPenalty"
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(e.target.value)}
                style={{
                  background: getRangeBackground(frequencyPenalty * 100),
                }}
              />
              <p className="popupSettingsAiItemValue">{frequencyPenalty}</p>
            </div>
            <Close
              className="popupSettingsAiItemDelete"
              onClick={() => setFrequencyPenalty(0)}
            />
          </div>
          <div className="popupParametersItem">
            <p className="popupParametersItemBtn">Presence Penalty</p>
            <div className="popupSettingsAiItemWrapper">
              <input
                className="popupSettingsAiBodyRange"
                type="range"
                min="-2"
                max="2"
                step="0.1"
                name="presencePenalty"
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(e.target.value)}
                style={{
                  background: getRangeBackground(presencePenalty * 100),
                }}
              />
              <p className="popupSettingsAiItemValue">{presencePenalty}</p>
            </div>
            <Close
              className="popupSettingsAiItemDelete"
              onClick={() => setPresencePenalty(0)}
            />
          </div>
        </div>
        <div className="popupParametersButtons">
          <Button onClick={handleSave} name="Save" />
          <Button onClick={handleClose} name="Close" />
          <Button onClick={handleReset} name="↩ Reset" />
        </div>
      </div>
    </div>
  );
}
