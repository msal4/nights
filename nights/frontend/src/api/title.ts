import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"
import { TitleDetail } from "~core/interfaces/title"
import client from "./client"
import { Season } from "~core/interfaces/season"

export const getTitles = (
  params: {} = {}
): Promise<PaginatedResults<HomeResults>> => client.get("/titles/", { params })

export const getTitle = (id: number | string): Promise<TitleDetail> =>
  client.get(`/titles/${id}/`)

export const getSeason = (id: number | string): Promise<Season> =>
  client.get(`/seasons/${id}/`)
