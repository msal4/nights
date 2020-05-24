import React from "react"
import { IconContext } from "react-icons"
import { I18nextProvider } from "react-i18next"

import "./styles/App.scss"
import i18n from "../i18n"
import { AuthProvider } from "~context/auth-context"
import { BackgroundProvider } from "~context/background-context"
import AppRouter from "~pages/Router"

export const App = () => {
  return (
    <div className="mx-5 my-3 md:mx-10 md:my-5 lg:mx-16 min-h-full">
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <BackgroundProvider>
            <IconContext.Provider value={{ size: "2em" }}>
              <AppRouter />
            </IconContext.Provider>
          </BackgroundProvider>
        </AuthProvider>
      </I18nextProvider>
    </div>
  )
}
