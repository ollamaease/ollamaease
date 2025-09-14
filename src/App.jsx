import React from "react";
import AiMessenger from "../src/content/aiMessenger/AiMessenger";
import TopBar from "../src/content/topBar/TopBar";
import Footer from "../src/content/footer/Footer";

export default function App() {
  return (
    <>
      <TopBar />
      <div>
        <AiMessenger />
      </div>
      <Footer />
    </>
  );
}
