import React, { FunctionComponent, useEffect, useState } from "react"

import EpisodeList from "~components/EpisodeList"
import { getSeason } from "~api/title"
import { Season } from "~core/interfaces/season"

export interface SeasonProps {
  seasonId: number
  seriesId: string | number
}

const Season: FunctionComponent<SeasonProps> = ({ seriesId, seasonId }) => {
  const { season, error } = useSeason(seasonId)

  if (!season && !error) return <div>Loading...</div>
  else if (error) return <div>error</div>

  return <EpisodeList seriesId={seriesId} season={season} />
}

const useSeason = (id: string | number) => {
  const [season, setSeason] = useState<Season>(null)
  const [error, setError] = useState(null)

  const getSeasonDetail = async () => {
    try {
      setSeason(await getSeason(id))
      if (error) setError(null)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getSeasonDetail()
  }, [id])

  return { season, error }
}

export default Season
