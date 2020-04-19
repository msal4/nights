import React, { useState } from "react"
import {
  IoIosAdd,
  IoIosMenu,
  IoIosCloseCircleOutline,
  IoIosSearch,
} from "react-icons/io"
import { Link, useRouteMatch } from "react-router-dom"
import "../styles/Header.scss"
import Search from "~components/Search"
import { I18nContext, useTranslation } from "react-i18next"

const useMenuOpenedState = (value: boolean) => {
  const [menuOpened, setMenuOpened] = useState(value)
  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)
  return { menuOpened, openMenu, closeMenu }
}

export default () => {
  const { menuOpened, openMenu, closeMenu } = useMenuOpenedState(false)
  const { path } = useRouteMatch()
  const { t, i18n } = useTranslation()
  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language == "ar" ? "en" : "ar")

  return (
    <nav className="py-4 md:flex md:justify-between font-thin">
      <div className="flex items-center justify-between">
        <Link className="select-none" to="/">
          <img
            className="h-10 object-contain"
            src="/static/frontend/images/logo.png"
            alt="1001Nights"
          />
        </Link>
        <IoIosCloseCircleOutline
          className={`${menuOpened ? "block" : "hidden"} md:hidden`}
          onClick={closeMenu}
        />
        <IoIosMenu
          className={`${!menuOpened ? "block" : "hidden"} md:hidden`}
          onClick={openMenu}
        />
      </div>
      <div
        className={`mt-2 ${
          menuOpened ? "block" : "hidden"
        } md:block md:flex md:items-center md:mt-0 md:justify-between md:w-full`}
      >
        <div className="flex justify-between text-gray-600 md:ml-6 md:text-sm lg:text-base">
          <Link className={path === "/" && "font-bold text-white"} to="/">
            {t("home")}
          </Link>
          <Link
            className={`md:ml-5 ${
              path === "/movies" && "font-bold text-white"
            }`}
            to="/movies"
          >
            {t("movies")}
          </Link>
          <Link
            className={`md:ml-5 ${
              path === "/series" && "font-bold text-white"
            }`}
            to="/series"
          >
            {t("series")}
          </Link>
          <Link
            className={`md:ml-5 ${
              path === "/series" && "font-bold text-white"
            }`}
            to="/kids"
          >
            {t("kids")}
          </Link>
        </div>
        <div className="md:flex">
          <Search className="md:mx-2 md:w-56" />
          <div className="flex items-center justify-between mt-2 md:mt-0 md:ml-2">
            <Link
              className="flex items-center md:mr-1 lg:mr-6 md:hidden lg:flex"
              to="/my_list"
            >
              <IoIosAdd />
              {t("myList")}
            </Link>
            <Link
              className="md:mr-1 lg:mr-6 rounded-full px-3 border-1 md:hover:bg-white md:hover:text-black"
              to="/signin"
            >
              {t("signIn")}
            </Link>
            <button onClick={toggleLanguage}>{t("lang")}</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
