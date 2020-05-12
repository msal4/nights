import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"

import Player from "~components/Player"
import { Episode } from "~core/interfaces/episode"
import { hitTopic, getTitle, getSeason, getHit } from "~api/title"
import { useAuth } from "~context/auth-context"
import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { Season } from "~core/interfaces/season"
import { getImageUrl } from "~utils/common"
import { SeasonProvider } from "~context/season-context"
import { useDisposableEffect } from "~hooks"

const SeriesPlayer: FunctionComponent = () => {
  const history = useHistory()
  const { token } = useAuth()
  const { data, error } = useEpisode(token)

  const { series, season, episode } = data

  const onUpdatePosition = async (position: number, duration: number) => {
    if (token) {
      await hitTopic(series.id, {
        playback_position: position,
        runtime: duration,
        season: season.id,
        episode: episode.id,
      })
    }
  }

  if (error) return <div>{error.message}</div>
  if (!episode) return <div>Loading...</div>

  return (
    <SeasonProvider seasonId={season.id} series={series} defaultSeason={season}>
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
interface DataState {
  series: TitleDetail
  season: Season
  episode: Episode
}

const useEpisode = (token: string) => {
  let { seriesId, seasonId, episodeIndex } = useParams()

  const [data, setData] = useState<DataState>({
    series: null,
    season: null,
    episode: null,
  })
  const [error, setError] = useState(null)

  useDisposableEffect(
    disposed => {
      getSeasonDetail(disposed)
    },
    [seriesId, seasonId, episodeIndex]
  )

  const getSeasonDetail = async (disposed: boolean) => {
    try {
      if (
        seriesId === data.series?.id.toString() &&
        seasonId === data.season?.id.toString()
      ) {
        const episode = getEpisode(data.season, episodeIndex)
        setData({ ...data, episode })
      }

      const series = await getTitle(seriesId)

      if (seasonId === "auto" && episodeIndex === "auto") {
        try {
          const hit = token && (await getHit(seriesId))
          console.log(hit)
          seasonId = hit?.season?.toString() || series.seasons[0].id.toString()
          episodeIndex = hit?.episode?.index.toString()
        } catch (error) {
          seasonId = series.seasons[0]?.id.toString()
        }
      }

      const season = await getSeason(seasonId)

      if (!episodeIndex) {
        episodeIndex = season.episodes[0]?.index.toString()
      }

      const episode = getEpisode(season, episodeIndex)

      if (!disposed) {
        setData({ ...data, series, season, episode })
      }

      // Clean
      if (error && !disposed) setError(null)
    } catch (error) {
      !disposed && setError(error)
    }
  }

  const getEpisode = (season: Season, index: string) => {
    const episode = season.episodes.find(
      episode => episode.index.toString() === index
    )

    if (!episode) throw Error("No Episode Found.")

    return episode
  }

  return { data, setData, error, setError }
}

export default SeriesPlayer
