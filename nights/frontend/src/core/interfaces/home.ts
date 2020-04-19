import { Title, TitleDetail } from "./title"
import { ViewHit } from "./view-hit"

export interface HomeResults {
  rows: GenreRow[]
  featured: Title[]
  recently_added: Title[]
  recently_watched?: ViewHit[]
  recommended?: TitleDetail
}

export interface GenreRow {
  id: number
  name: string
  title_list: Title[]
}
