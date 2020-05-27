import React from "react"
import { Redirect } from "react-router"
import { useTranslation } from "react-i18next"

import { useAuth } from "../context/auth-context"
import { Link } from "react-router-dom"
import { FaUserAlt } from "react-icons/fa"

export default () => {
  const { token } = useAuth()
  const { t } = useTranslation()

  if (token) return <Redirect to="/landing" />

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center opacity-75">{t("signUpNowToEnjoy")}</h1>
      <div className="mt-8 flex items-center">
        <Link
          className="px-6 py-3 flex items-center justify-center rounded-full bg-n-red hover:border-1 transition-all duration-200"
          style={{ minWidth: "15rem" }}
          to="/landing/register"
        >
          <FaUserAlt className="text-xss mr-4" />
          {t("createAccount")}
        </Link>
        <Link
          className="ml-8 px-6 py-3 text-center rounded-full border-1 hover:bg-white hover:text-black transition-all duration-200"
          style={{ minWidth: "15rem" }}
          to="/landing/register"
        >
          {t("signIn")}
        </Link>
      </div>
    </div>
  )
}
