//
import React from 'react'
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'

import Header from '~components/Header'
import SeriesPlayer from './SeriesPlayer'
import MoviePlayer from './MoviePlayer'
import TitlePage from './TitlePage'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import MyListPage from './MyListPage'
import SearchPage from './SearchPage'
import RegisterPage from './RegisterPage'
import {useBackground} from '~context/background-context'

const AppRouter = () => {
  const {background} = useBackground()
  return (
    <Router>
      <div className="absolute inset-0 transition-all duration-1000" style={{
        background: `linear-gradient(150deg, rgba(0,0,0,0) 0%, rgba(0,0,8,1) 38%, rgba(0,0,8,1) 49%, rgba(0,0,8,1) 100%), url(${background})`,
        filter: 'blur(15px)',
        opacity: .5
      }}/>
      <Header/>
      <Switch>
        <Route exact path="/series/:seriesId/:seasonId/:episodeIndex/play">
          <SeriesPlayer/>
        </Route>
        <Route exact path="/movie/:id/play">
          <MoviePlayer/>
        </Route>
        <Route path="/title/:id">
          <TitlePage/>
        </Route>
        <Route exact path="/register">
          <RegisterPage/>
        </Route>
        <Route exact path="/login">
          <LoginPage/>
        </Route>
        <Route path="/my_list">
          <MyListPage/>
        </Route>
        <Route path="/search">
          <SearchPage/>
        </Route>
        <Route path="/movies">
          <HomePage filters={{type: 'm'}}/>
        </Route>
        <Route path="/series">
          <HomePage filters={{type: 's'}}/>
        </Route>
        <Route path="/kids">
          <HomePage filters={{rated: 'G'}}/>
        </Route>
        <Route path="/">
          <HomePage/>
        </Route>
      </Switch>
    </Router>
  )
}

export default AppRouter
