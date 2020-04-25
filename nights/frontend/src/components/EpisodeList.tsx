import React, { FunctionComponent } from "react"

import { Season } from "~core/interfaces/season"

export interface EpisodeListProps {
  season: Season
}

const EpisodeList: FunctionComponent<EpisodeListProps> = ({ season }) => {
  return <div>{season.name}</div>
}

export default EpisodeList
