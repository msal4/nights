import React, { FunctionComponent, useEffect, useState } from "react"

import { getSeason } from "~api/title"
import EpisodeList from "~components/EpisodeList"

export interface SeasonProps {
  seasonId: number
}

const useSeason = () => {
  const [season, setSeason] = useState(null)
  const [error, setError] = useState(null)
  return { season, setSeason, error, setError }
}

const Season: FunctionComponent<SeasonProps> = ({ seasonId }) => {
  const { season, setSeason, error, setError } = useSeason()

  const getSeasonDetail = async () => {
    try {
      setSeason(await getSeason(seasonId))
      if (error) setError(null)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getSeasonDetail()
  }, [seasonId])

  if (!season && !error) return <div>Loading...</div>
  else if (error) {
    console.log(error)
    return <div>error</div>
  }
  return <EpisodeList season={season} />
}

export default Season
