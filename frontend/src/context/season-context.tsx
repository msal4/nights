import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from "react"
import { Season, SimpleSeason } from "../core/interfaces/season"
import { getSeason } from "../api/title"
import { TitleDetail } from "../core/interfaces/title"

export interface SeasonConsumer {
  season: Season | null
  series: TitleDetail | null
  getSeason: (seasonId: string | number) => Promise<void>
  setSeason: (season: Season) => void
}

export interface SeasonProviderProps {
  seasonId: string | number
  series: TitleDetail
  defaultSeason?: Season | null
}

const SeasonContext = React.createContext<SeasonConsumer>({
  season: null,
  series: null,
  getSeason: async seasonId => {},
  setSeason: season => {},
})

export const SeasonProvider: FunctionComponent<SeasonProviderProps> = ({
  seasonId,
  defaultSeason = null,
  series,
  children,
}) => {
  const [season, setSeason] = useState<Season | null>(defaultSeason)
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
    getSeasonDetail(seasonId || "")
  }, [seasonId == defaultSeason?.id])

  return (
    <SeasonContext.Provider
      value={{ season, series, setSeason, getSeason: getSeasonDetail }}
    >
      {children}
    </SeasonContext.Provider>
  )
}

export const useSeason = () => useContext<SeasonConsumer>(SeasonContext)
