import React, { FunctionComponent, useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"

import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { getTitle, hitTopic, getHit } from "~api/title"
import Player from "~components/Player"
import { useAuth } from "~context/auth-context"
import { ViewHit } from "~core/interfaces/view-hit"
import { getImageUrl } from "~utils/common"
import LoadingIndicator from "~components/LoadingIndicator"

const MoviePlayer: FunctionComponent = () => {
  const { id } = useParams()
  const history = useHistory()
  const { token } = useAuth()
  const { title, hit, error, loading } = useTitle(id, token)

  const onUpdatePosition = async (position: number, duration: number) => {
    if (token) {
      await hitTopic(title.id, {
        playback_position: position,
        runtime: duration,
      })
    }
  }

  return (
    <div>
      <LoadingIndicator show={loading} />
      {title && (
        <Player
          name={title.name}
          history={history}
          title={title}
          videos={title.videos}
          subtitles={title.subtitles || []}
          poster={getImageUrl(title.images[0]?.url, ImageQuality.h900)}
          onUpdatePosition={onUpdatePosition}
          position={hit?.playback_position || 0}
        />
      )}
    </div>
  )
}

const useTitle = (id: string | number, token: string) => {
  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hit, setHit] = useState<ViewHit>(null)

  const getTitleDetail = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTitleDetail()
  }, [id, token])

  return { title, hit, error, loading }
}

export default MoviePlayer
