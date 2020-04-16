import { Title } from "./title"
import { Season } from "./season"
import { Episode } from "./episode"

export interface ViewHit {
  id: number
  user: number
  topic: Title
  season: Season
  episode: Episode
  playback_position: number
  runtime: number
  hit_date: Date
}
