import React from "react";
import "./ripple.css";

export default function Ripple() {
  return (
    <>
      <div className="pond">
        <img className="pondImg" src="https://ollama.com/public/ollama.png" alt="ollama_logo" />
        <div className="square-ripple"></div>
        <div className="square-ripple delay"></div>
      </div>
    </>
  );
}
