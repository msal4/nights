import React, { FunctionComponent } from "react"

import SeasonDropdown from "./containers/SeasonDropdown"
import { useSeason } from "../context/season-context"
import EpisodeList from "./EpisodeList"

const PlayerSidebar: FunctionComponent = () => {
  const { season, series, getSeason } = useSeason()

  return (
    <div className="py-5 px-2 text-white">
      <SeasonDropdown
        seasons={series.seasons}
        currentSeason={season}
        onChange={season => {
          getSeason(season.id)
        }}
      />
      <div className="pt-4">
        <EpisodeList season={season} seriesId={series.id} />
      </div>
    </div>
  )
}

export default PlayerSidebar
