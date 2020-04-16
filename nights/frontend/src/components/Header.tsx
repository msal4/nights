import React from "react"
import { AppContext } from "./App"
import { useTranslation } from "react-i18next"

export default () => {
  const { t, i18n } = useTranslation()

  return (
    <AppContext.Consumer
      children={({ lang, authenticated, theme }) => (
        <div>
          {t("home")}
          <h3 className="hover:bg-blue-300 hover:text-gray-100 rounded p-2 cursor-pointer">
            You are {authenticated ? "authenticated" : "not authenticated"}.
          </h3>
          <h3
            className="hover:bg-blue-300 select-none rounded p-2 cursor-pointer"
            onClick={(e) =>
              i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
            }
          >
            You language is {i18n.language}.
          </h3>
          <h3 className="hover:bg-blue-300 hover:text-gray-100 rounded p-2 cursor-pointer">
            You theme is {theme}.
          </h3>
        </div>
      )}
    ></AppContext.Consumer>
  )
}
