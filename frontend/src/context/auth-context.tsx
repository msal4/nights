import React, { FunctionComponent, useState } from "react"

import AuthToken from "~utils/auth-token"
import { loginUser, registerUser } from "~api/user"

const AuthContext = React.createContext(null)

export interface Auth {
  token: string
  login: (username: string, password: string) => Promise<void>
  logout: VoidFunction
  register: (email: string, username: string, password: string) => Promise<void>
}

const useToken = () => {
  const [token, setToken] = useState<string>(AuthToken.get())
  const storeToken = (token: string) => {
    AuthToken.store(token)
    setToken(token)
  }
  const removeToken = () => {
    AuthToken.remove()
    setToken(null)
  }
  return { token, storeToken, removeToken }
}

const AuthProvider: FunctionComponent<{}> = props => {
  const { token, storeToken, removeToken } = useToken()

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    await registerUser(email, username, password)
    await login(username, password)
  }

  const login = async (username: string, password: string) => {
    const data = await loginUser(username, password)
    storeToken(data.auth_token)
  }

  const logout = () => removeToken()

  return (
    <AuthContext.Provider
      value={{ token, login, logout, register }}
      {...props}
    />
  )
}

const useAuth = () => React.useContext<Auth>(AuthContext)

export { AuthProvider, useAuth }
