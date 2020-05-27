import React, { useState, FunctionComponent } from "react"
import { IoIosAdd, IoIosMenu, IoMdClose } from "react-icons/io"
import { Link, useRouteMatch } from "react-router-dom"
import { useTranslation } from "react-i18next"

import "../styles/Header.scss"
import Search from "../components/Search"
import { useAuth } from "../context/auth-context"

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
      className={`opacity-50 py-2 px-3 hover:opacity-100 ${
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
  const match = useRouteMatch({ path: "/landing" })

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language == "ar" ? "en" : "ar")

  return (
    <nav className="mb-8 pt-10 pb-4 relative z-10 md:flex md:justify-between font-thin">
      <div className="flex items-center justify-between">
        <Link className="select-none" to="/home">
          <img
            className="object-contain"
            style={{ maxWidth: "12rem", minWidth: "12rem" }}
            src="/static/frontend/images/logo.svg"
            alt="1001Nights"
          />
        </Link>
        <IoMdClose
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
        } md:block md:flex md:items-center md:mt-0 md:justify-between ${
          !match ? "md:w-full" : ""
        }`}
      >
        {!match && (
          <div className="flex flex-col md:flex-row justify-between md:ml-6 md:text-sm lg:text-base">
            <NavLink to="/home">{t("home")}</NavLink>
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
        )}
        <div className="md:flex">
          {!match && <Search className="md:mx-2" />}
          <div className="mt-4 md:mt-0 md:ml-2 flex items-center justify-between">
            {!match && (
              <Link
                className="flex items-center md:hidden lg:flex hover:opacity-75"
                to="/my_list"
              >
                <IoIosAdd />
                {t("myList")}
              </Link>
            )}
            <button
              className={`${
                i18n.language === "en" ? "mb-1" : "mt-1"
              } md:ml-1 lg:ml-6 hover:opacity-75`}
              onClick={toggleLanguage}
            >
              {t("lang")}
            </button>
            <div className="md:ml-1 lg:ml-6">
              {token ? (
                <button className="hover:text-red-600" onClick={logout}>
                  {t("logout")}
                </button>
              ) : (
                <Link
                  className="rounded-full px-3 py-1 border-1 md:hover:bg-white md:hover:text-black"
                  to="/landing/login"
                >
                  {t("signIn")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
