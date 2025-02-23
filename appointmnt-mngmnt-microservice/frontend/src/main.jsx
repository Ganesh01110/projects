import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/AppStore/Store.js";
import ToastNotification from "./components/ToastNotifications.jsx"; 
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <App />
      <ToastNotification/>
    </BrowserRouter>
   </Provider>
);
