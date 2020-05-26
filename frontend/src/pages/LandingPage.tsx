import React from "react"

import LandingSitePromo from '~/components/LandingSitePromo'
import {Switch, Route, useRouteMatch} from "react-router-dom"

import LoginPage from "./LoginPage"
import CWPage from "./CWPage"
import {IoIosArrowDown} from "react-icons/io"
import {useTranslation} from "react-i18next"



export default () => {
  const {url} = useRouteMatch()
  const {t} = useTranslation()

  return <div id="landing-page-container">
    <div id="promo-main-section" style={{height: 'calc(100vh - 9.5rem)'}}>

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

        <IoIosArrowDown className="scroll-down-arrow absolute mx-auto text-sm"
          style={{left: '50%', bottom: '1rem', transform: 'translateX(-50%)'}} />
      </div>
    </div>

    <div style={{margin: '0 -4rem'}}>

      <div className="relative flex flex-column items-center justify-center bg-white text-black" style={{zIndex: 1000, height: '30rem'}}>
        <div className="flex items-center">
          <img src="/static/frontend/images/devices_promo.png" style={{width: '20rem'}} />
          <div className="ml-32 max-w-xs">
            <h1 className="font-semibold text-lg">Available Now on All Devices</h1>
            <p className="mt-2 text-sm font-thin">Enjoy all your favorite media at one place, wherever and whenever you want.</p>
            <div className="mt-6 flex items-center">
              <img className="w-32" src="/static/frontend/images/google_play_white.png" />
              <img className="ml-4 w-32" src="/static/frontend/images/ios_app_store_white.png" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-56 flex items-center justify-center"
        style={{background: 'linear-gradient(270deg, #00000000 -10%, #18001F 60%) 0% 0% no-repeat padding-box, url(/static/frontend/images/media_promo.png)'}}>

        <img className="h-30" src="/static/frontend/images/media_logo.svg" />
        <div className="ml-24 max-w-sm">
          <h1 className="font-semibold text-lg">Download Your Essentials</h1>
          <p className="mt-2 font-thin">PC software, games and more...</p>
          <a className="mt-4 inline-block px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 text-black bg-white hover:bg-black hover:text-white"
            href="#">
            {t('visitSite')}
          </a>
        </div>

      </div>

    </div>

  </div>
}


