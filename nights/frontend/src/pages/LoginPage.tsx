import React, { FunctionComponent, useRef } from "react"
import { useAuth } from "~context/auth-context"
import { Redirect } from "react-router-dom"

const LoginPage: FunctionComponent = () => {
  const { token, login } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const onLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    const username = usernameRef?.current?.value
    const password = passwordRef?.current?.value
    await login(username, password)
    if (token) {
      usernameRef.current.value = ""
      passwordRef.current.value = ""
    }
  }

  if (token) return <Redirect to="/" />

  return (
    <div className="pt-10">
      {token}
      <form className="max-w-md mx-auto flex flex-col items-center">
        <input
          ref={usernameRef}
          className="py-2 px-4 block mt-4 bg-gray-900 rounded-full self-stretch"
          type="text"
          name="username"
          placeholder="Username"
        />
        <input
          ref={passwordRef}
          className="py-2 px-4 block mt-4 bg-gray-900 rounded-full self-stretch"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          className="py-2 px-6 inline-block mt-4 bg-red-700 max-w-sm rounded-full"
          onClick={onLogin}
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
