import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"
import { TitleDetail } from "~core/interfaces/title"
import client from "./client"

export const getTitles = (
  params: {} = {}
): Promise<PaginatedResults<HomeResults>> => client.get("/titles/", { params })

export const getTitle = (id: string): Promise<TitleDetail> =>
  client.get(`/titles/${id}/`)
