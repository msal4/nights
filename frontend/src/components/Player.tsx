import React, { FunctionComponent, useRef, useState } from "react"
import videojs, { VideoJsPlayer } from "video.js"
import { History } from "history"

import "video.js/src/css/video-js.scss"
import "~styles/Player.scss"
import { Video, Subtitle } from "~core/interfaces/topic"
import { swapEpisodeUrlId } from "~utils/common"
import { vjsComponent, vjsTitleBar } from "./vjs-components"
import PlayerSidebar from "./PlayerSidebar"
import { useDisposableEffect } from "~hooks"

// Register videojs components
vjsComponent.registerComponent("vjsTitleBar", vjsTitleBar)

const getVideoUrl = (video: Video) => {
  const format = video.formats.split(",")[0] || "mp4"
  // Shift the id before the season index for legacy reasons
  const url = swapEpisodeUrlId(
    video.url.replace("{q}", "720").replace("{f}", format)
  )
  return { url, format }
}

type OnUpdatePositionCallback = (
  position: number,
  duration: number
) => void | Promise<void>

export interface PlayerProps {
  name: string
  history: History
  videos: Video[]
  subtitles: Subtitle[]
  poster: string
  position: number
  onUpdatePosition?: OnUpdatePositionCallback
  displaySidebar?: boolean
}

const Player: FunctionComponent<PlayerProps> = ({
  name,
  history,
  videos,
  subtitles,
  poster,
  onUpdatePosition,
  position = 0,
  displaySidebar = false,
}) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const seasonRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  useDisposableEffect(
    disposed => {
      const player = videojs(videoNode.current, {
        sources: videos.map(video => {
          const { format, url } = getVideoUrl(video)
          return {
            src: url,
            type: format === "mp4" ? "video/mp4" : "application/x-mpegURL",
          }
        }),
        tracks: subtitles.map(subtitle => ({
          kind: "captions",
          src: swapEpisodeUrlId(subtitle.url.replace("{f}", "vtt")),
          srcLang: subtitle.language,
          label: subtitle.language === "ar" ? "العربية" : "English",
          default: subtitle.language === "ar",
        })),
      })

      // Set the current time from view hit
      player.currentTime(position)

      // Update the position for the parent to handle it
      player.on(
        "timeupdate",
        () => !disposed && handleTimeUpdate(player, position, onUpdatePosition)
      )

      // Toggle sidebar
      player.on(
        "togglesidebar",
        () => !disposed && setShowSidebar(showSidebar => !showSidebar)
      )

      // Add title bar
      player.addChild("vjsTitleBar", {
        title: name,
        goBack: () => history.push("/"),
        displaySidebar,
      })

      const disposeFullscreenButton = replaceFullscreenButton(
        videoContainerRef,
        player
      )

      return () => {
        disposeFullscreenButton()
        player.dispose()
      }
    },
    [videos && videos[0]?.url]
  )

  return (
    <div
      ref={videoContainerRef}
      className="absolute inset-0 z-10 overflow-hidden player text-black"
    >
      <div data-vjs-player style={{ width: showSidebar ? "75vw" : "100vw" }}>
        <video
          ref={videoNode}
          id="video-js-player"
          className="video-js"
          poster={poster}
          autoPlay
          controls
          playsInline
        />
      </div>
      {displaySidebar && (
        <div
          ref={seasonRef}
          className="season-container bg-gray-900 overflow-auto"
          style={{ right: showSidebar ? "0" : "-25vw" }}
        >
          <PlayerSidebar />
        </div>
      )}
    </div>
  )
}

const handleTimeUpdate = (
  player: VideoJsPlayer,
  position: number,
  onUpdatePosition: OnUpdatePositionCallback
) => {
  const currentPosition = Math.floor(player.currentTime())
  // Check if the player seeked over 30 secs or the user is seeking back
  if (currentPosition > position + 30 || currentPosition < position) {
    // Update the position
    const duration = Math.floor(player.duration())
    position = currentPosition

    onUpdatePosition && position && onUpdatePosition(position, duration)
  }
}

const replaceFullscreenButton = (
  ref: React.MutableRefObject<HTMLDivElement>,
  player: VideoJsPlayer
) => {
  let isFullscreen = false

  ref.current.onfullscreenchange = e => {
    isFullscreen = !isFullscreen
  }

  const toggleFullscreen = () => {
    if (isFullscreen) document.exitFullscreen()
    else ref.current.requestFullscreen()
  }
  const el = videojs.dom.$(".vjs-fullscreen-control").cloneNode(true)

  videojs.dom.$(".vjs-fullscreen-control").replaceWith(el)
  el.addEventListener("click", toggleFullscreen)
  player.ready(function () {
    ;(player as any).tech_.off("dblclick")
  })

  player.on("dblclick", toggleFullscreen)

  return () => el.removeEventListener("click", toggleFullscreen)
}

export default Player
