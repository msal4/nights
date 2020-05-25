import client from "./client"

import {PaginatedResults} from "~core/interfaces/paginated-results"
import {HomeResults} from "~core/interfaces/home"
import {TitleDetail, Title} from "~core/interfaces/title"
import {Season} from "~core/interfaces/season"
import {Episode} from "~core/interfaces/episode"
import {ViewHitData} from "~core/interfaces/topic"
import {ViewHit} from "~core/interfaces/view-hit"
import {sortTopics} from "~utils/common"

export const getTitles = (
  params: {} = {}
): Promise<PaginatedResults<Title[]>> => client.get("/titles/", {params})

export const getTitle = async (id: number | string): Promise<TitleDetail> => {
  const title: TitleDetail = await client.get(`/titles/${id}/`)
  title.type === "s" && (title.seasons = sortTopics(title.seasons))
  return title
}

export const getSeason = async (id: number | string): Promise<Season> => {
  const season: Season = await client.get(`/seasons/${id}/`)
  season.episodes = sortTopics(season.episodes) as Episode[]
  return season
}

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

export const addToMyList = (id: string | number): Promise<{detail: string}> =>
  client.post("/my_list/", {id})

export const removeFromMyList = (id: string | number) =>
  client.delete(`/my_list/${id}/`)

export const getPromos = (limit: number = 4, type?: string): Promise<TitleDetail[]> =>
  client.get('/promos/', {data: {limit, type}})

