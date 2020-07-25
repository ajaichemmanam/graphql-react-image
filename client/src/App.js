import React from "react";
import { ApolloProvider } from "react-apollo";

import logo from "./logo.svg";
import "./App.css";
import client from "./apollo.js";
import ConvertScreen from "./components/ConvertScreen.js";
import UploadScreen from "./components/UploadScreen.js";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <UploadScreen/>
        <ConvertScreen />
      </div>
    </ApolloProvider>
  );
}

export default App;
