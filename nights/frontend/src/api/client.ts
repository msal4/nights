import axios from "axios"
import AuthToken from "~utils/auth-token"
import { useAuth } from "~context/auth-context"

const client = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
})

client.interceptors.request.use((config) => ({
  ...config,
  headers: AuthToken.get() && {
    Authorization: `Token ${AuthToken.token}`,
  },
}))

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default client
