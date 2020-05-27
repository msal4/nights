class AuthToken {
  static tokenKey = "auth_token"
  static token: string = null

  static get = () => {
    if (AuthToken.token) return AuthToken.token
    AuthToken.token = localStorage.getItem(AuthToken.tokenKey)
    return AuthToken.token
  }

  static store = (token: string) => {
    AuthToken.token = token
    localStorage.setItem(AuthToken.tokenKey, token)
  }

  static remove = () => {
    AuthToken.token = null
    localStorage.removeItem(AuthToken.tokenKey)
  }
}

export default AuthToken
