# OllamaEase

OllamaEase is a simple, privacy-focused Chrome extension that lets you
interact effortlessly with local AI models running via
[Ollama](https://ollama.com/).\
It provides a clean user interface for chatting with LLMs directly in
your browser --- no external APIs, no cloud, just local intelligence.

------------------------------------------------------------------------

## ✨ Features

-   **Local-only AI** -- All inference stays on your machine.\
-   **Clean UI** -- Minimal, distraction-free chat interface.\
-   **No accounts, no tracking** -- 100% privacy-respecting.\
-   **Fast setup** -- Works with any Ollama model you have installed.

------------------------------------------------------------------------

## 📦 Installation

### 1. Install Ollama

Make sure you have [Ollama](https://ollama.com/) installed and a model
pulled (for example, `ollama pull llama3`).

### 2. Start the Ollama server

Run:

``` bash
OLLAMA_ORIGINS=chrome-extension://* ollama serve
```

This allows the Chrome extension to communicate with your local Ollama
server.

<!-- ### 3. Add the Extension

Once published, you can install OllamaEase directly from the\
[Chrome Web Store](https://chrome.google.com/webstore/detail/ollamaease/your-extension-id-here). -->

> **Development / Manual Install**\
> 1. Clone this repository and run `npm install` and `npm run build`.\
> 2. Go to `chrome://extensions/` in Chrome.\
> 3. Enable **Developer mode** and click **Load unpacked**.\
> 4. Select the `dist` folder created by the build.

------------------------------------------------------------------------

## 🛠 Development

-   Built with **React + Vite**.

-   Uses standard Chrome Extension Manifest V3 APIs.

-   To start a development server with hot reloading:

    ``` bash
    npm install
    npm run dev
    ```

-   To create a production build:

    ``` bash
    npm run build
    ```

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!\
Feel free to open an [issue](../../issues) or submit a pull request.

------------------------------------------------------------------------

## 📝 License

This project is licensed under the [MIT License](LICENSE).

------------------------------------------------------------------------

## 🙋 FAQ

**Q:** Does it send any data to the cloud?\
**A:** No. All inference and chat history remain on your machine.

**Q:** What models can I use?\
**A:** Any model available through Ollama, such as LLaMA 3, Mistral, or
custom models you've imported.

------------------------------------------------------------------------

## 🔗 Links

-   [Ollama Documentation](https://github.com/ollama/ollama)
-   [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
