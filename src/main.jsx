import React from 'react';
import ReactDOM from 'react-dom/client';
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from './App';

const root = document.getElementById('root');
disableReactDevTools();
ReactDOM.createRoot(root).render(<App />);