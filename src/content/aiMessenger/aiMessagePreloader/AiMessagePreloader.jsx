import React from "react";
import "./aiMessagePreloader.css";
import { SpeakerNotesOff } from "@mui/icons-material";
import Markdown from "markdown-to-jsx";

export default function AiMessagePreloader(props) {
  const { answer, interruptAssistant } = props;
  return (
    <>
      <div className="messageTextPreloader">
        {<Markdown>{`${answer} 🖊`}</Markdown>}
        <span>
          <div className="messageTextPreloaderControl">
            <div className="messageTextPreloaderInterrupt">
              <SpeakerNotesOff
                style={{
                  color: "var(--gray)",
                  fontSize: "1rem",
                }}
                className="messageTextPreloaderInterruptBtn"
                onClick={interruptAssistant}
              />
            </div>
          </div>
        </span>
      </div>
    </>
  );
}
