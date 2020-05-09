import client from "./client"

import { PaginatedResults } from "~core/interfaces/paginated-results"
import { HomeResults } from "~core/interfaces/home"
import { TitleDetail, Title } from "~core/interfaces/title"
import { Season } from "~core/interfaces/season"
import { Episode } from "~core/interfaces/episode"
import { ViewHitData } from "~core/interfaces/topic"
import { ViewHit } from "~core/interfaces/view-hit"

export const getTitles = (
  params: {} = {}
): Promise<PaginatedResults<HomeResults>> => client.get("/titles/", { params })

export const getTitle = (id: number | string): Promise<TitleDetail> =>
  client.get(`/titles/${id}/`)

export const getSeason = (id: number | string): Promise<Season> =>
  client.get(`/seasons/${id}/`)

export const getEpisode = (id: number | string): Promise<Episode> =>
  client.get(`/episodes/${id}/`)

export const getHistory = (): Promise<PaginatedResults<ViewHit[]>> =>
  client.get("/history/")

export const getHit = (id: string | number): Promise<ViewHit> =>
  client.get(`/history/${id}/`)

export const hitTopic = (topicId: number | string, data: ViewHitData) =>
  client.put(`/history/${topicId}/`, data)

export const getMyList = (): Promise<PaginatedResults<Title[]>> =>
  client.get("/my_list/")

export const checkMyList = (id: string | number) =>
  client.get(`/my_list/${id}/`)

export const addToMyList = (id: string | number): Promise<{ detail: string }> =>
  client.post("/my_list/", { id })

export const removeFromMyList = (id: string | number) =>
  client.delete(`/my_list/${id}/`)
