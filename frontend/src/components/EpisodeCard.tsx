import React, { FunctionComponent } from "react"

import { Episode } from "~core/interfaces/episode"
import NImage from "./NImage"
import { Link } from "react-router-dom"
import PlayIcon from "~icons/PlayIcon"
import "../styles/EpisodeCard.scss"

export interface EpisodeCardProps {
  episode: Episode
  seriesId: string | number
  seasonId: string | number
}

const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({
  seriesId,
  seasonId,
  episode,
}) => {
  return (
    <Link
      to={`/series/${seriesId}/${seasonId}/${episode.index}/play`}
      className="episode-card-container flex items-start mb-4 p-2 rounded-lg md:mb-6 hover:bg-gray-900"
    >
      <NImage className="h-20 w-32 mr-2 md:mr-4 md:h-32 md:w-48 flex items-center justify-center">
        <div className="episode-play-icon bg-white rounded-full">
          <PlayIcon />
        </div>
      </NImage>
      <div>
        <h4 className="mb-1 text-base md:text-xl text-n-red">
          {episode.index + 1}
        </h4>
        <h4 className="text-xs font-thin md:text-lg">{episode.name}</h4>
      </div>
    </Link>
  )
}

export default EpisodeCard
