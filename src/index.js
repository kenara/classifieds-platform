import React, { Component } from "react"
import ReactDOM from "react-dom"
import { StateProvider } from "./components/StateProvider.js"
import App from "./components/App.js"

const app = document.getElementById("root")

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  app
)
