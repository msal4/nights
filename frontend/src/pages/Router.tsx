import React from "react"
import {Switch, Route, BrowserRouter as Router} from "react-router-dom"

import Header from "~components/Header"
import Background from "~components/Background"
import LandingPage from "./LandingPage"
import CinemaPage from "./CinemaPage"
import ScrollToTop from '~components/ScrollToTop'

export default () => {
  return (
    <>
      <Router>
        {/*        <ScrollToTop /> */}
        <Background />
        <Header />
        <Switch>
          <Route path="/landing">
            <LandingPage />
          </Route>
          <Route path="/">
            <CinemaPage />
          </Route>
        </Switch>
      </Router>
    </>
  )
}
