import React, { FunctionComponent, useEffect, useRef } from "react"
import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import videojs from "video.js"
import { getImageUrl } from "~utils/common"
import { useTranslation } from "react-i18next"

interface TrailerProps {
  title: TitleDetail
  className?: string
}

const Trailer: FunctionComponent<TrailerProps> = ({ title, className }) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const { t } = useTranslation()

  const src = title?.trailers[0]?.url.replace("{f}", "mp4")
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900)

  useEffect(() => {
    const player = videojs(videoNode.current, {
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
      poster,
    })

    return () => {
      player.dispose()
    }
  }, [src])

  return (
    <div className={`relative mt-8 ${className}`}>
      <h2 className="mb-10 text-4xl font-bold">{t("trailer")}</h2>
      <div
        data-vjs-player
        style={{
          width: "100%",
          height: "0",
          paddingTop: "55%",
        }}
      >
        <video
          ref={videoNode}
          className="video-js absolute inset-0"
          controls
          playsInline
        />
      </div>
    </div>
  )
}

export default Trailer
