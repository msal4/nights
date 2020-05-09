import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"

import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { getTitle, hitTopic, getHit } from "~api/title"
import Player from "~components/Player"
import { useAuth } from "~context/auth-context"
import { ViewHit } from "~core/interfaces/view-hit"
import { getImageUrl } from "~utils/common"

const MoviePlayer: FunctionComponent = () => {
  const { id } = useParams()
  const history = useHistory()
  const { token } = useAuth()
  const { title, hit, error } = useTitle(id, token)

  const onUpdatePosition = async (position: number, duration: number) => {
    if (token) {
      await hitTopic(title.id, {
        playback_position: position,
        runtime: duration,
      })
    }
  }

  if (!title) return <div>Loading...</div>
  return (
    <Player
      name={title.name}
      history={history}
      videos={title.videos}
      subtitles={title.subtitles || []}
      poster={getImageUrl(title.images[0]?.url, ImageQuality.h900)}
      onUpdatePosition={onUpdatePosition}
      position={hit?.playback_position || 0}
    />
  )
}

const useTitle = (id: string | number, token: string) => {
  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState(null)
  const [hit, setHit] = useState<ViewHit>(null)

  const getTitleDetail = async () => {
    try {
      const title = await getTitle(id)
      if (token) {
        try {
          const data = await getHit(title.id)
          setHit(data)
        } catch (error) {
          console.log(error)
        }
      }
      if (error) setError(null)
      setTitle(title)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getTitleDetail()
  }, [id, token])

  return { title, setTitle, hit, setHit, error, setError }
}

export default MoviePlayer
