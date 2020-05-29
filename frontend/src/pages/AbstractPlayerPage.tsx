import React, { FunctionComponent, useEffect, useRef } from "react"
import videojs from "video.js"
import { useParams } from "react-router"
const urls = {
  mp4: "http://cdn0.1001nights.fun/m//37H087uHGz/720.mp4",
  m3u8: "http://cdn1.1001nights.fun/s/1768/0/1/720.m3u8",
}
export default () => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const { type } = useParams()

  useEffect(() => {
    const player = videojs(videoNode.current, {
      sources: [
        {
          src: (urls as any)[type],
          type: type === "mp4" ? "video/mp4" : "application/x-mpegURL",
        },
      ],
    })

    return () => {
      player.dispose()
    }
  }, [])

  return (
    <div data-vjs-player>
      <video
        ref={videoNode}
        className="video-js vjs-16-9"
        controls
        playsInline
        autoPlay
      />
    </div>
  )
}
