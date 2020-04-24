import { Topic } from "./topic"
import { Season } from "./season"

export interface TitleDetail {
  id: number
  name: string
  plot: string
  runtime: number
  imdb: string
  rating: number
  rated: string
  type: string
  is_new: boolean
  views: number
  seasons: Season[]
  genres: Topic[]
  cast: Topic[]
  images: Image[]
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
  images: Image[]
  genres: Topic[]
  released_at: string
}

export interface Image {
  url: string
}

export enum ImageQuality {
  h900 = "900h",
  v250 = "250v",
  v100 = "100v",
}
