import { useLocation } from "react-router-dom"
import queryString from "query-string"

export const useQuery = () => queryString.parse(useLocation().search)
