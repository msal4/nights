import client from "./client"
import {PaginatedResults} from "~core/interfaces/paginated-results"
import {HomeResults} from "~core/interfaces/home"

export const getHome = (params = {}): Promise<PaginatedResults<HomeResults>> =>
  client.get("/home/", {params})

