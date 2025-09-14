import React from "react";
import "./footer.css";
import { GitHub } from "@mui/icons-material";

export default function Footer() {
  const date = new Date();
  return (
    <div className="footer">
      <div className="footerContainer">
        <div className="footerContainerInner">
          <a
            className="footerContainerText"
            href="https://github.com/ollamaease/ollamaease"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub className="iconTransformScale" />
            GitHub
          </a>
          <h3 className="footerContainerText">{date.getFullYear()} </h3>
          <h3 className="footerContainerText">
            <a href="https://ollama.com/" target="_blank" rel="noreferrer">
              ollama.com
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
}
