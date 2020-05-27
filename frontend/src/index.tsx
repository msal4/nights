import "core-js/es"
import "raf/polyfill"

import React from "react"
import ReactDom from "react-dom"

import App from "./App"

ReactDom.render(<App />, document.getElementById("app"))
