import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import Player from "~components/Player"
import { Episode } from "~core/interfaces/episode"
import { getEpisode } from "~api/title"

const useTitle = () => {
  const [episode, setEpisode] = useState<Episode>(null)
  const [error, setError] = useState(null)

  return { episode, setEpisode, error, setError }
}

const SeriesPlayer: FunctionComponent = () => {
  const { id } = useParams()
  const { episode, setEpisode, error, setError } = useTitle()

  const getEpisodeDetail = async () => {
    try {
      const episode = await getEpisode(id)
      if (error) setError(null)
      setEpisode(episode)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getEpisodeDetail()
  }, [id])

  if (!episode) return <div>Loading...</div>
  return <Player videos={episode.videos} subtitles={episode.subtitles || []} />
}

export default SeriesPlayer
