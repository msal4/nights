import axios from "axios"

import * as api from "~constants/api"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"

export const getTitles = () =>
  axios.get<PaginatedResults<HomeResults>>(`${api.home}`)
