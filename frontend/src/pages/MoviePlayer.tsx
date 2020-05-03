import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { TitleDetail } from "~core/interfaces/title"
import { getTitle, hitTopic, getHit } from "~api/title"
import Player from "~components/Player"
import { useAuth } from "~context/auth-context"
import { ViewHit } from "~core/interfaces/view-hit"

const useTitle = () => {
  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState(null)
  const [hit, setHit] = useState<ViewHit>(null)

  return { title, setTitle, hit, setHit, error, setError }
}

const MoviePlayer: FunctionComponent = () => {
  const { id } = useParams()
  const { title, setTitle, hit, setHit, error, setError } = useTitle()
  const { token } = useAuth()

  const getTitleDetail = async () => {
    try {
      const title = await getTitle(id)
      if (token) {
        try {
          const data = await getHit(title.id)
          console.log(data)
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

  const onUpdatePosition = async (position: number, duration: number) => {
    if (token) {
      await hitTopic(title.id, {
        playback_position: position,
        runtime: duration,
      })
    }
  }

  useEffect(() => {
    getTitleDetail()
  }, [id, token])

  if (!title) return <div>Loading...</div>
  return (
    <Player
      videos={title.videos}
      subtitles={title.subtitles || []}
      onUpdatePosition={onUpdatePosition}
      position={hit?.playback_position || 0}
    />
  )
}

export default MoviePlayer
