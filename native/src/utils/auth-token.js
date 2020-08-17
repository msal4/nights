class AuthToken {
  static tokenKey = 'auth_token';
  static token = null;

  static get = () => {
    if (AuthToken.token) return AuthToken.token;
    AuthToken.token = localStorage.getItem(AuthToken.tokenKey);
    return AuthToken.token;
  };

  /**
   * @param {string} token
   */
  static store = (token) => {
    AuthToken.token = token;
    localStorage.setItem(AuthToken.tokenKey, token);
  };

  static remove = () => {
    AuthToken.token = null;
    localStorage.removeItem(AuthToken.tokenKey);
  };
}

export default AuthToken;
