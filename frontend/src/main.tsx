import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import WindowSetter from './WindowSetter.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <React.StrictMode>
      <WindowSetter />
    </React.StrictMode>
  </Router>,
);
