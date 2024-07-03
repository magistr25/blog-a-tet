import React from "react";
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client"; // Изменен импорт
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import store from './redux/store';

const container = document.getElementById("root"); // Получаем контейнер
const root = createRoot(container); // Создаем корневой элемент

root.render(
    <React.StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
