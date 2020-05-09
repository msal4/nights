import React, { useState, FunctionComponent } from "react"
import { IoIosAdd, IoIosMenu, IoIosCloseCircleOutline } from "react-icons/io"
import { Link, useRouteMatch, useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import "../styles/Header.scss"
import Search from "~components/Search"
import { useAuth } from "~context/auth-context"

const useMenuOpenedState = (value: boolean) => {
  const [menuOpened, setMenuOpened] = useState(value)
  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)
  return { menuOpened, openMenu, closeMenu }
}

interface NavLinkProps {
  className?: string
  to: string
}

const NavLink: FunctionComponent<NavLinkProps> = ({
  to,
  className,
  children,
}) => {
  const match = useRouteMatch({ path: to, exact: true })

  return (
    <Link
      className={`opacity-50 py-2 px-3 rounded-full hover:bg-gray-900 hover:opacity-100 ${
        match && "font-bold opacity-100"
      } ${className}`}
      to={to}
    >
      {children}
    </Link>
  )
}

export default () => {
  const { menuOpened, openMenu, closeMenu } = useMenuOpenedState(false)
  const { t, i18n } = useTranslation()
  const { token, logout } = useAuth()

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language == "ar" ? "en" : "ar")

  return (
    <nav className="py-4 relative z-10 md:flex md:justify-between font-thin">
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
        <div className="flex justify-between md:ml-6 md:text-sm lg:text-base">
          <NavLink to="/">{t("home")}</NavLink>
          <NavLink className="md:ml-2" to="/movies">
            {t("movies")}
          </NavLink>
          <NavLink className="md:ml-2" to="/series">
            {t("series")}
          </NavLink>
          <NavLink className="md:ml-2" to="/kids">
            {t("kids")}
          </NavLink>
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
            <div className="md:mr-1 lg:mr-6">
              {token ? (
                <button className="hover:text-red-600" onClick={logout}>
                  {t("logout")}
                </button>
              ) : (
                <Link
                  className="rounded-full px-3 py-1 border-1 md:hover:bg-white md:hover:text-black"
                  to="/login"
                >
                  {t("signIn")}
                </Link>
              )}
            </div>
            <button onClick={toggleLanguage}>{t("lang")}</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
