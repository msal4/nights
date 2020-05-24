import React from "react"
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom"

import SeriesPlayer from "./SeriesPlayer"
import MoviePlayer from "./MoviePlayer"
import TitlePage from "./TitlePage"
import RegisterPage from "./RegisterPage"
import LoginPage from "./LoginPage"
import MyListPage from "./MyListPage"
import SearchPage from "./SearchPage"
import HomePage from "./HomePage"

export default () => {
  const { url } = useRouteMatch()
  console.log(url, "hello")
  return (
    <Switch>
      <Route path="/series/:seriesId/:seasonId/:episodeIndex/play">
        <SeriesPlayer />
      </Route>
      <Route path="/movie/:id/play">
        <MoviePlayer />
      </Route>
      <Route path="/title/:id">
        <TitlePage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Route path="/login">
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
      <Route path="/home">
        <HomePage />
      </Route>
      <Route exact path="/">
        () => <Redirect to="/landing" />
      </Route>
    </Switch>
  )
}
