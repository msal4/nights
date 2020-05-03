import client from "./client"
import { LoginData, UserDetail } from "~core/interfaces/user"

export const loginUser = (
  username: string,
  password: string
): Promise<LoginData> =>
  client.post("/auth/token/login/", { username, password })

export const registerUser = (
  email: string,
  username: string,
  password: string
): Promise<UserDetail> =>
  client.post("/auth/users/", { email, username, password })
