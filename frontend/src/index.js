import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store'; // Adjust the import path to your store
import { LoadScript } from '@react-google-maps/api';

import "./styles/styles.css"; // Import common styles
import App from "./App";


const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y";

ReactDOM.render(

    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
    </LoadScript>
    ,
    document.getElementById("root")
);
