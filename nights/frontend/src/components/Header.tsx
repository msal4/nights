import React, { useState } from "react"
import {
  IoIosAdd,
  IoIosMenu,
  IoIosCloseCircleOutline,
  IoIosSearch,
} from "react-icons/io"
import { Link } from "react-router-dom"
import "../styles/Header.scss"
import Search from "~components/Search"

const useMenuOpenedState = (value: boolean) => {
  const [menuOpened, setMenuOpened] = useState(value)
  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)
  return { menuOpened, openMenu, closeMenu }
}

export default () => {
  const { menuOpened, openMenu, closeMenu } = useMenuOpenedState(false)

  return (
    <nav className="py-4 md:flex md:justify-between">
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
        <div className="flex justify-between opacity-50 md:ml-6 md:text-sm lg:text-base">
          <Link to="/">Home</Link>
          <Link className="md:ml-5" to="/movies">
            Movies
          </Link>
          <Link className="md:ml-5" to="/series">
            Series
          </Link>
          <Link className="md:ml-5" to="/kids">
            Kids
          </Link>
        </div>
        <div className="md:flex">
          <Search className="md:mx-2 w-56" />
          <div className="flex items-center justify-between mt-2 md:mt-0 md:ml-2">
            <Link
              className="flex items-center md:mr-1 lg:mr-6 md:hidden lg:flex"
              to="/my_list"
            >
              <IoIosAdd />
              My List
            </Link>
            <Link to="/signin">Sign in</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
