import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import Background from "../components/Background";
import LandingPage from "./LandingPage";
import CinemaPage from "./CinemaPage";
import AbstractPlayerPage from "./AbstractPlayerPage";

export default () => {
  const { t } = useTranslation();
  return (
    <>
      <Router>
        <Background />
        <Header />
        <div className="min-h-screen">
          <Switch>
            <Route path="/landing">
              <LandingPage />
            </Route>
            <Route path="/player/:type">
              <AbstractPlayerPage />
            </Route>
            <Route path="/">
              <CinemaPage />
            </Route>
          </Switch>
        </div>
        <div
          id="app-footer"
          className="text-xs md:text-base md:h-24 px-4 py-2 md:px-8 md:py-4 flex items-center justify-between h-rainbow"
        >
          <img
            className="w-16"
            src="/static/frontend/images/nights_logo_white.svg"
            style={{ maxWidth: "12rem", minWidth: "12rem" }}
          />
          <span className="font-thin opacity-75 mx-2">{t("copyright")}</span>
          <a
            className="flex items-center font-thin"
            href="https://fb.com/1001nights.fun"
            target="_blank"
          >
            <FaFacebookSquare className="mr-2" />
            <span className="hidden md:inline">{t("contactUsOnFacebook")}</span>
          </a>
        </div>
      </Router>
    </>
  );
};
