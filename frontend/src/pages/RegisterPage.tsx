import React, { FunctionComponent, useRef, useState } from "react"
import { useAuth } from "~context/auth-context"
import { Redirect, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const RegisterPage: FunctionComponent = () => {
  const { token, register } = useAuth()
  const emailRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()
  const [error, setError] = useState(null)

  const onRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    const email = emailRef?.current?.value
    const username = usernameRef?.current?.value
    const password = passwordRef?.current?.value
    try {
      console.log(email, username, password)
      await register(email, username, password)
      error && setError(null)
    } catch (error) {
      setError(error)
    }
  }

  if (token) return <Redirect to="/" />

  return (
    <div className="pt-10">
      <h1 className="text-5xl font-bold text-center">{t("register")}</h1>
      <form className="max-w-md mx-auto flex flex-col items-center">
        <input
          ref={usernameRef}
          className="py-4 px-6 block mt-4 rounded-full self-stretch transition-all duration-200 bg-gray-900 focus:shadow-outline"
          type="text"
          name="username"
          placeholder={t("username")}
        />
        <input
          ref={emailRef}
          className="py-4 px-6 block mt-4 rounded-full self-stretch transition-all duration-200 bg-gray-900 focus:shadow-outline"
          type="text"
          name="email"
          placeholder={t("email")}
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
          onClick={onRegister}
        >
          {t("register")}
        </button>
        <Link className="mt-4" to="/login">
          <span className="opacity-75">{t("haveAnAccount")}</span>{" "}
          <span className="text-blue-600">{t("login")}</span>
        </Link>
      </form>
    </div>
  )
}

export default RegisterPage
