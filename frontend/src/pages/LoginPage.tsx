import React, { FunctionComponent, useRef, useState } from "react"
import { useAuth } from "~context/auth-context"
import { Redirect, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const LoginPage: FunctionComponent = () => {
  const { token, login } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  const onLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    const username = usernameRef?.current?.value
    const password = passwordRef?.current?.value
    try {
      await login(username, password)
      error && setError(null)
    } catch (error) {
      setError(error)
    }
  }

  if (token) return <Redirect to="/" />

  return (
    <div className="pt-10">
      <h1 className="text-5xl font-bold text-center">{t("login")}</h1>
      <form className="max-w-md mx-auto flex flex-col items-center">
        <input
          ref={usernameRef}
          className="py-4 px-6 block mt-4 rounded-full self-stretch transition-all duration-200 bg-gray-900 focus:shadow-outline"
          type="text"
          name="username"
          placeholder={t("username")}
        />
        <input
          ref={passwordRef}
          className="py-4 px-6 block mt-4 bg-gray-900 rounded-full self-stretch focus:shadow-outline"
          type="password"
          name="password"
          placeholder={t("password")}
        />
        <button
          className="py-4 px-8 inline-block mt-4 max-w-sm rounded-full transition-all duration-200 bg-red-700 hover:bg-blue-700"
          onClick={onLogin}
        >
          {t("login")}
        </button>
        <Link className="mt-4" to="/register">
          <span className="opacity-75">{t("dontHaveAnAccount")}</span>{" "}
          <span className="text-blue-600">{t("register")}</span>
        </Link>
      </form>
    </div>
  )
}

export default LoginPage
