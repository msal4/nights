//
import React from "react"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"
import { createBrowserHistory } from "history"

import Header from "~components/Header"
import SeriesPlayer from "./SeriesPlayer"
import MoviePlayer from "./MoviePlayer"
import TitlePage from "./TitlePage"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage"
import MyListPage from "./MyListPage"
import SearchPage from "./SearchPage"

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/series/:seriesId/:seasonId/:episodeIndex/play">
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
        <Route path="/my_list">
          <MyListPage />
        </Route>
        <Route path="/search">
          <SearchPage />
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
  )
}

export default AppRouter
