import React from "react"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"

import Header from "~components/Header"
import Background from "~components/Background"
import SeriesPlayer from "./SeriesPlayer"
import MoviePlayer from "./MoviePlayer"
import TitlePage from "./TitlePage"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage"
import MyListPage from "./MyListPage"
import SearchPage from "./SearchPage"
import RegisterPage from "./RegisterPage"
import LandingPage from "./LandingPage"
import CinemaPage from "./CinemaPage"

export default () => {
  return (
    <>
      <Router>
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
