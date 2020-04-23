import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"
import { TitleDetail } from "~core/interfaces/title"
import client from "./interceptors"

export const getTitles = (
  filters: {} = {}
): Promise<PaginatedResults<HomeResults>> => client.get("/titles/")

export const getTitle = (id: string): Promise<TitleDetail> =>
  client.get(`/titles/${id}/`)
