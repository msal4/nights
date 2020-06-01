import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { cleanObjectProperties } from "../utils/common";

export const useQuery = () =>
  cleanObjectProperties(queryString.parse(useLocation().search));
