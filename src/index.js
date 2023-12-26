import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Создаем корневой элемент React, используя метод createRoot,
// и передаем ему DOM-элемент с идентификатором 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим React-приложение в указанном корневом элементе.

// Оборачиваем компонент App в компонент React.StrictMode.
// React.StrictMode предназначен для выявления потенциальных проблем в приложении
// и предупреждения о них в консоли разработчика.
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
