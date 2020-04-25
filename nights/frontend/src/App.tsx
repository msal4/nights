import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { IconContext } from "react-icons"
import { I18nextProvider } from "react-i18next"

import "./styles/App.scss"
import TitlePage from "./pages/TitlePage"
import HomePage from "./pages/HomePage"
import Header from "./components/Header"
import i18n from "../i18n"

export const App = () => {
  return (
    <div className="mx-5 my-3 md:mx-10 md:my-5 lg:mx-16 xl:max-w-6xl xl:mx-auto">
      <I18nextProvider i18n={i18n}>
        <IconContext.Provider value={{ size: "2em" }}>
          <Router>
            <Header />
            <Switch>
              <Route key="title-detail" path="/title/:id">
                <TitlePage />
              </Route>
              <Route exact key="home" path="/">
                <HomePage />
              </Route>
            </Switch>
          </Router>
        </IconContext.Provider>
      </I18nextProvider>
    </div>
  )
}
