import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react"
import { Season, SimpleSeason } from "~core/interfaces/season"
import { getSeason } from "~api/title"
import { TitleDetail } from "~core/interfaces/title"

const SeasonContext = React.createContext(null)

export interface SeasonProviderProps {
  seasonId: string | number
  series: TitleDetail
  defaultSeason?: Season
}

export const SeasonProvider: FunctionComponent<SeasonProviderProps> = ({
  seasonId,
  defaultSeason = null,
  series,
  children,
}) => {
  const [season, setSeason] = useState<Season>(defaultSeason)
  const [error, setError] = useState(null)

  const getSeasonDetail = async (seasonId: string | number) => {
    try {
      setSeason(await getSeason(seasonId))

      if (error) setError(null)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getSeasonDetail(seasonId)
  }, [seasonId == defaultSeason.id])

  return (
    <SeasonContext.Provider
      value={{ season, series, setSeason, getSeason: getSeasonDetail, error }}
    >
      {children}
    </SeasonContext.Provider>
  )
}

export interface SeasonConsumer {
  season: Season
  series: TitleDetail
  getSeason: (seasonId: string | number) => Promise<void>
  setSeason: (season: Season) => void
}

export const useSeason = () => useContext<SeasonConsumer>(SeasonContext)
