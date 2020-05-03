import client from "./client"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"
import { ViewHit } from "~core/interfaces/view-hit"

export const getHome = (params = {}): Promise<PaginatedResults<HomeResults>> =>
  client.get("/home/", { params })

export const getHistory = (params = {}): Promise<ViewHit[]> =>
  client.get("/history/", { params })
