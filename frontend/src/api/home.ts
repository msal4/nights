import client from "./client"
import { TitleDetail, Title } from "../core/interfaces/title"
import { PaginatedResults } from "../core/interfaces/paginated-results"
import { GenreRow } from "../core/interfaces/home"

export const getPromos = (params: any): Promise<TitleDetail[]> =>
  client.get("/promos/", { params })

export const getRecentlyAdded = (
  params = {}
): Promise<PaginatedResults<Title[]>> =>
  client.get("/recently_added/", { params })

export const getGenreRows = (
  params = {}
): Promise<PaginatedResults<GenreRow[]>> =>
  client.get("/genre_rows/", { params })
