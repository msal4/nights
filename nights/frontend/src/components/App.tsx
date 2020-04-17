import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { IconContext } from "react-icons"

import "../styles/App.scss"
import TitlePage from "~pages/TitlePage"
import HomePage from "~pages/HomePage"
import Header from "~components/Header"

export const App = () => {
  return (
    <div className="mx-10 lg:mx-16">
      <IconContext.Provider value={{ size: "2em" }}>
        <Router>
          <Header />
          <Switch>
            <Route path="/title">
              <TitlePage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </IconContext.Provider>
    </div>
  )
}
