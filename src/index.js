import React, { Suspense } from "react";
import "./assets/scss/style.scss";
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<Loader />}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </Suspense>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
