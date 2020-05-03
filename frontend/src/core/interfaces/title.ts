import { Topic, Subtitle, Video, Trailer, Image } from "./topic"
import { Season } from "./season"

export interface TitleDetail {
  id: number
  name: string
  plot: string
  runtime: number
  imdb: string
  rating: number
  rated: string
  images: Image[]
  videos: Video[]
  subtitles: Subtitle[]
  trailers: Trailer[]
  type: string
  is_new: boolean
  views: number
  seasons: Season[]
  genres: Topic[]
  cast: Topic[]
  recommended: Title[]
  released_at: string
  created_at: string
  updated_at: string
}

export interface Title {
  id: number
  name: string
  type: string
  is_new: boolean
  rated: string
  rating: number | null
  runtime: number
  plot?: string | null
  images: Image[]
  genres: Topic[]
  released_at: string
}

export enum ImageQuality {
  h900 = "900h",
  v250 = "250v",
  v100 = "100v",
}
