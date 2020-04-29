//
import React from "react"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"

import Header from "~components/Header"
import SeriesPlayer from "./SeriesPlayer"
import MoviePlayer from "./MoviePlayer"
import TitlePage from "./TitlePage"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage"
// import { useBackground } from "~context/background-context"

const AppRouter = () => {
  // const { background } = useBackground()
  return (
    <>
      <div
        className="fixed inset-0"
        style={{
          zIndex: -10,
          background:
            "linear-gradient(127deg, #000008A8 0%, #000008F7 22%, #000008 100%) 0% 0% no-repeat padding-box, url(/static/frontend/images/dark.jpg)",
          backgroundSize: "cover",
          filter: "blur(100px)",
        }}
      />

      <Router>
        <Header />
        <Switch>
          <Route exact path="/episode/:id/play">
            <SeriesPlayer />
          </Route>
          <Route exact path="/movie/:id/play">
            <MoviePlayer />
          </Route>
          <Route path="/title/:id">
            <TitlePage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route path="/movies">
            <HomePage filters={{ type: "m" }} />
          </Route>
          <Route path="/series">
            <HomePage filters={{ type: "s" }} />
          </Route>
          <Route path="/kids">
            <HomePage filters={{ rated: "G" }} />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default AppRouter
