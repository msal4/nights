import React, {FunctionComponent, useState} from "react"

import AuthToken from "~utils/auth-token"
import {loginUser, registerUser} from "~api/user"

const AuthContext = React.createContext(null)

type LoginFunction = (username: string, password: string) => Promise<void>

export interface Auth {
  token: string
  login: LoginFunction
  register: LoginFunction
  logout: VoidFunction
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
  return {token, storeToken, removeToken}
}

const AuthProvider: FunctionComponent<{}> = props => {
  const {token, storeToken, removeToken} = useToken()

  const register: LoginFunction = async (username, password) => {
    await registerUser("", username, password)
    await login(username, password)
  }

  const login: LoginFunction = async (username, password) => {
    const data = await loginUser(username, password)
    storeToken(data.auth_token)
  }

  const logout = () => removeToken()

  return (
    <AuthContext.Provider
      value={{token, login, logout, register}}
      {...props}
    />
  )
}

const useAuth = () => React.useContext<Auth>(AuthContext)

export {AuthProvider, useAuth}
