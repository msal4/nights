import React, { FunctionComponent, useRef, useState } from "react"
import { useAuth } from "../context/auth-context"
import { Redirect, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export interface LoginPageProps {
  type: "login" | "register"
}

const LoginPage: FunctionComponent<LoginPageProps> = ({ type }) => {
  const { token, login, register } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  const onLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    const username = usernameRef?.current?.value
    const password = passwordRef?.current?.value
    try {
      if (type === "login") await login(username, password)
      else await register(username, password)
      error && setError(null)
    } catch (error) {
      setError(error)
    }
  }

  if (token) return <Redirect to="/landing" />

  return (
    <form className="max-w-sm mx-auto flex flex-col items-center">
      <input
        ref={usernameRef}
        className="py-2 px-6 block self-stretch bg-transparent opacity-75 focus:opacity-100 transition-all duration-200"
        style={{ borderBottomWidth: "1px" }}
        type="text"
        name="username"
        placeholder={t("username")}
      />
      <input
        ref={passwordRef}
        className="mt-8 py-2 px-6 block self-stretch bg-transparent opacity-75 focus:opacity-100 transition-all duration-200"
        style={{ borderBottomWidth: "1px" }}
        type="password"
        name="password"
        placeholder={t("password")}
      />
      <button
        className="mt-8 py-3 px-8 inline-block max-w-sm rounded-full transition-all duration-200 bg-n-red hover:bg-n-blue"
        onClick={onLogin}
      >
        {type === "login" ? t("login") : t("register")}
      </button>
      {type === "login" ? (
        <Link className="mt-6" to="/landing/register">
          <span className="opacity-75">{t("dontHaveAnAccount")}</span>{" "}
          <span className="text-n-red">{t("register")}</span>
        </Link>
      ) : (
        <Link className="mt-6" to="/landing/login">
          <span className="opacity-75">{t("haveAnAccount")}</span>{" "}
          <span className="text-n-red">{t("login")}</span>
        </Link>
      )}
    </form>
  )
}

export default LoginPage
