import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"

import Player from "~components/Player"
import { Episode } from "~core/interfaces/episode"
import { hitTopic, getTitle, getSeason } from "~api/title"
import { useAuth } from "~context/auth-context"
import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { Season } from "~core/interfaces/season"
import { getImageUrl } from "~utils/common"
import { SeasonProvider } from "~context/season-context"
import { useDisposableEffect } from "~hooks"

const SeriesPlayer: FunctionComponent = () => {
  const history = useHistory()
  const { seriesId, seasonId, episodeIndex } = useParams()
  const { token } = useAuth()
  const { data, error } = useEpisode(seriesId, seasonId, episodeIndex)

  const { series, season, episode } = data

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
    <SeasonProvider seasonId={seasonId} series={series} defaultSeason={season}>
      <Player
        name={episode.name}
        history={history}
        videos={episode.videos}
        subtitles={episode.subtitles || []}
        poster={getImageUrl(episode.images[0]?.url, ImageQuality.h900)}
        position={episode.hits && episode.hits[0]?.playback_position | 0}
        onUpdatePosition={onUpdatePosition}
        displaySidebar
      />
    </SeasonProvider>
  )
}

const useEpisode = (
  seriesId: string | number,
  seasonId: string | number,
  episodeIndex: string
) => {
  interface DataState {
    series: TitleDetail
    season: Season
    episode: Episode
  }

  const [data, setData] = useState<DataState>({
    series: null,
    season: null,
    episode: null,
  })
  const [error, setError] = useState(null)

  const getEpisode = (season: Season, index: string) => {
    const episode = season.episodes.find(
      episode => episode.index.toString() === index
    )

    if (!episode) throw Error("No Episode Found.")

    return episode
  }

  const getSeasonDetail = async (disposed: boolean) => {
    try {
      if (seriesId == data.series?.id && seasonId == data.season?.id) {
        const episode = getEpisode(data.season, episodeIndex)
        setData({ ...data, episode })
      }

      const series = await getTitle(seriesId)
      const season = await getSeason(seasonId)
      const episode = await getEpisode(season, episodeIndex)

      if (!disposed) {
        setData({ ...data, series, season, episode })
      }

      // Clean
      if (error && !disposed) setError(null)
    } catch (error) {
      !disposed && setError(error)
    }
  }

  useDisposableEffect(
    disposed => {
      getSeasonDetail(disposed)
    },
    [seriesId, seasonId, episodeIndex]
  )

  return { data, setData, error, setError }
}

export default SeriesPlayer
