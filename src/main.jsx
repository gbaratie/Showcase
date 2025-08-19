import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './style.css';

// Le point d'entrée de l'application. Nous utilisons BrowserRouter pour la
// navigation. Le `basename` est défini à partir de la variable d'environnement
// BASE_URL générée par Vite. Cela garantit que les routes fonctionnent
// correctement lorsque l'application est servie dans un sous-répertoire sur
// GitHub Pages.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);