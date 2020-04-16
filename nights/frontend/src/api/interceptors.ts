import axios from "axios"

axios.interceptors.request.use(
  (response) => {
    console.log("a request is sent to", response.url)
    return response
  },
  (error) => {
    console.log(error)
  }
)
