import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import Player from "~components/Player"
import { Episode } from "~core/interfaces/episode"
import { hitTopic, getTitle, getSeason } from "~api/title"
import { useAuth } from "~context/auth-context"
import { TitleDetail } from "~core/interfaces/title"
import { Season } from "~core/interfaces/season"

const SeriesPlayer: FunctionComponent = () => {
  const { seriesId, seasonId, episodeIndex } = useParams()
  const { token } = useAuth()
  const { series, season, episode, error } = useEpisode(
    seriesId,
    seasonId,
    episodeIndex
  )

  const onUpdatePosition = async (position: number, duration: number) => {
    if (token) {
      await hitTopic(series.id, {
        playback_position: position,
        runtime: duration,
        season: seasonId,
        episode: episode.id,
      })
    }
  }

  if (error) return <div>{error.message}</div>
  if (!episode) return <div>Loading...</div>
  return (
    <Player
      name={episode.name}
      videos={episode.videos}
      subtitles={episode.subtitles || []}
      position={episode.hits[0]?.playback_position | 0}
      onUpdatePosition={onUpdatePosition}
    />
  )
}

const useEpisode = (
  seriesId: string | number,
  seasonId: string | number,
  episodeIndex: string
) => {
  const [series, setSeries] = useState<TitleDetail>(null)
  const [season, setSeason] = useState<Season>(null)
  const [episode, setEpisode] = useState<Episode>(null)
  const [error, setError] = useState(null)

  const getEpisode = (season: Season, index: string) =>
    season.episodes.find(episode => episode.index.toString() === index)

  const getSeasonDetail = async () => {
    try {
      const series = await getTitle(seriesId)
      const season = await getSeason(seasonId)

      setSeries(series)
      setSeason(season)

      // Get episode
      const episode = getEpisode(season, episodeIndex)
      if (!episode) throw Error("No Episode Found.")

      // Clean
      if (error) setError(null)

      setEpisode(episode)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getSeasonDetail()
  }, [seriesId, seasonId])

  return { series, season, episode, setEpisode, error, setError }
}

export default SeriesPlayer
