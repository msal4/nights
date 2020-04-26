import React, { FunctionComponent } from "react"

import { Season } from "~core/interfaces/season"
import EpisodeCard from "./EpisodeCard"

export interface EpisodeListProps {
  season: Season
}

const EpisodeList: FunctionComponent<EpisodeListProps> = ({ season }) => {
  return (
    <div>
      {season.episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  )
}

export default EpisodeList
