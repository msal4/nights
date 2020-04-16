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
  recommended: Title[]
  released_at: Date
  created_at: Date
  updated_at: Date
}

export interface Title {
  id: number
  name: string
  type: Type
  is_new: boolean
  rated: Rated
  rating: number | null
  genres: Topic[]
  released_at: Date
}

export enum Rated {
  G = "G",
  PG = "PG",
  PG13 = "PG-13",
  R = "R",
}

export enum Type {
  M = "m",
  S = "s",
}
