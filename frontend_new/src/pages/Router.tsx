import React from "react"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"
import { FaFacebookSquare } from "react-icons/fa"
import { useTranslation } from "react-i18next"

import Header from "../components/Header"
import Background from "../components/Background"
import LandingPage from "./LandingPage"
import CinemaPage from "./CinemaPage"

export default () => {
  const { t } = useTranslation()
  return (
    <>
      <Router>
        {/*        <ScrollToTop /> */}
        <Background />
        <Header />
        <div className="min-h-screen">
          <Switch>
            <Route path="/landing">
              <LandingPage />
            </Route>
            <Route path="/">
              <CinemaPage />
            </Route>
          </Switch>
        </div>
        <div
          className="h-24 px-8 py-4 flex items-center justify-between h-rainbow"
          style={{ margin: "0 -4rem" }}
        >
          <img
            className="w-16"
            src="/static/frontend/images/nights_logo_white.svg"
            style={{ maxWidth: "12rem", minWidth: "12rem" }}
          />
          <span className="font-thin opacity-75">{t("copyright")}</span>
          <a
            className="flex items-center font-thin"
            href="https://fb.com/1001nights.fun"
            target="_blank"
          >
            <FaFacebookSquare className="mr-2" />
            {t("contactUsOnFacebook")}
          </a>
        </div>
      </Router>
    </>
  )
}
