import React from "react";
import "./aiMessageThinking.css";
import { SpeakerNotesOff } from "@mui/icons-material";
import Dots from "../aiUiKit/animation/dots/Dots";
import Markdown from "markdown-to-jsx";

export default function AiMessageThinking(props) {
  const { reasoning, interruptAssistant } = props;
  return (
    <>
      {reasoning.length > 3 && (
        <fieldset className="chatAiMessengerThinking" id="dataThinking">
          <legend className="chatAiMessengerThinkingLegend">
            <img
              className="messageHeaderThinkingImg"
              src="icons/thinkingAi.png"
              alt="AI_avatar"
            />
            Thinking
            <Dots />
            <div className="messageTextPreloaderInterrupt">
              <SpeakerNotesOff
                style={{
                  color: "var(--gray)",
                  fontSize: "1rem",
                }}
                onClick={interruptAssistant}
              />
            </div>
          </legend>
          {reasoning.length > 3 && (
            <div className="thinkingText">
              {<Markdown>{`${reasoning} 🧠`}</Markdown>}
            </div>
          )}
        </fieldset>
      )}
    </>
  );
}
