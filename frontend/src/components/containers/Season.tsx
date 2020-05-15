import React, { FunctionComponent, useEffect, useState } from "react"

import EpisodeList from "~components/EpisodeList"
import { getSeason } from "~api/title"
import { Season } from "~core/interfaces/season"
import LoadingIndicator from "~components/LoadingIndicator"

export interface SeasonProps {
  seasonId: number
  seriesId: string | number
}

const Season: FunctionComponent<SeasonProps> = ({ seriesId, seasonId }) => {
  const { season, error } = useSeason(seasonId)

  return (
    <>
      <LoadingIndicator show={!season && !error} />
      {season && <EpisodeList seriesId={seriesId} season={season} />}
    </>
  )
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
