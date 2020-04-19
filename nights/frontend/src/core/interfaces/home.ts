import { Title, TitleDetail } from "./title"
import { ViewHit } from "./view-hit"

export interface HomeResults {
  rows: Row[]
  featured: Title[]
  recently_added: Title[]
  recently_watched?: ViewHit[]
  recommended?: TitleDetail
}

export interface Row {
  id: number
  name: string
  title_list: Title[]
}
