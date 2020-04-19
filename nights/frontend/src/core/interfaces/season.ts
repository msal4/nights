import { Episode } from "./episode"

export interface Season {
  id: number
  name: string
  index: number
  episodes: Episode[]
  released_at: string
}
