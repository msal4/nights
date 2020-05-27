import React, { FunctionComponent } from "react"

import { Season } from "../core/interfaces/season"
import EpisodeCard from "./EpisodeCard"

export interface EpisodeListProps {
  season: Season
  seriesId: string | number
}

const EpisodeList: FunctionComponent<EpisodeListProps> = ({
  season,
  seriesId,
}) => {
  return (
    <div>
      {season.episodes.map(episode => (
        <EpisodeCard
          key={episode.id}
          seriesId={seriesId}
          seasonId={season.id}
          episode={episode}
        />
      ))}
    </div>
  )
}

export default EpisodeList
