import { Title, TitleDetail } from "./title"
import { ViewHit } from "./view-hit"

export interface HomeResults {
  rows: GenreRow[]
  featured: TitleDetail[]
  recently_added: Title[]
  recently_watched?: ViewHit[]
  recommended?: Title
}

export interface GenreRow {
  id: number
  name: string
  title_list: Title[]
}
