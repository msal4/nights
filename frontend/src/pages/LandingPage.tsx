import React from "react"

import LandingSitePromo from '~/components/LandingSitePromo'
import {Switch, Route, useRouteMatch} from "react-router-dom"

import LoginPage from "./LoginPage"
import CWPage from "./CWPage"



export default () => {
  const {url} = useRouteMatch()

  return <div>
    <div className="absolute top-0 left-0 right-0 h-screen" style={{
      backgroundImage: `url(/static/frontend/images/landing_background.jpg)`,
      backgroundSize: 'cover',
      zIndex: -1
    }} />
    <div className="mx-auto max-w-5xl">
      <div className="mt-12 flex items-center justify-between">
        <LandingSitePromo
          action={() => null} image={"/static/frontend/images/mulan.jpg"}
          logo={"/static/frontend/images/nights_logo_white.svg"} title={"Play Now"} url={""} />
        <LandingSitePromo action={() => null} logo={"/static/frontend/images/tv_logo_white.svg"} image={"/static/frontend/images/mulan.jpg"} title={"Watch Now"} url={""} />
      </div>
      <div className="mt-4">
        <Switch>
          <Route path={`${url}/login`}>
            <LoginPage type="login" />
          </Route>
          <Route path={`${url}/register`}>
            <LoginPage type="register" />
          </Route>
          <Route path={url}>
            <CWPage />
          </Route>
        </Switch>
      </div>
    </div>
  </div >
}


