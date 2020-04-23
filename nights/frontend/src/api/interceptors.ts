import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
})

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default client
