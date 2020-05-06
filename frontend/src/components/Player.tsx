import React, { FunctionComponent, useEffect, useRef } from "react"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

import { Video, Subtitle } from "~core/interfaces/topic"
import { swapEpisodeUrlId } from "~utils/common"
import "~styles/Player.scss"

const Component = videojs.getComponent("Component")

export interface PlayerTitleBarOptions extends VideoJsPlayerOptions {
  text?: string
}

class PlayerTitleBar extends Component {
  constructor(player: VideoJsPlayer, options: PlayerTitleBarOptions) {
    super(player, options)

    options.text && this.updateTextContent(options.text)
  }

  createEl() {
    return videojs.dom.createEl("div", { className: "vjs-title-bar" })
  }

  updateTextContent(text: string) {
    if (typeof text !== "string") {
      text = "Title Unknown"
    }

    videojs.dom.emptyEl(this.el())
    videojs.dom.appendContent(this.el(), text)
  }
}

videojs.registerComponent("TitleBar", PlayerTitleBar)

export interface PlayerProps {
  name: string
  videos: Video[]
  subtitles: Subtitle[]
  position: number
  onUpdatePosition?: (
    position: number,
    duration: number
  ) => void | Promise<void>
}

const Player: FunctionComponent<PlayerProps> = ({
  name,
  videos,
  subtitles,
  onUpdatePosition,
  position = 0,
}) => {
  const videoNode = useRef(null)

  useEffect(() => {
    const player = videojs(videoNode.current)
    // Set the current time from view hit
    player.currentTime(position)
    // Update the position for the parent to handle it
    player.on("timeupdate", () => {
      const currentPosition = Math.floor(player.currentTime())
      // Check if the player seeked over 30 secs or the user is seeking back
      if (currentPosition >= position + 30 || currentPosition <= position) {
        // Update the position
        const duration = Math.floor(player.duration())
        position = currentPosition

        onUpdatePosition && position && onUpdatePosition(position, duration)
      }
    })

    // Add title bar
    player.addChild("TitleBar", { text: name })

    return () => {
      player.dispose()
    }
  }, [])

  const renderVideo = (video: Video) => {
    const format = video.formats.split(",")[0] || "mp4"
    // Shift the id before the season index for legacy reasons
    const url = swapEpisodeUrlId(
      video.url.replace("{q}", "720").replace("{f}", format)
    )

    return (
      <source
        key={url}
        src={url}
        type={format === "mp4" ? "video/mp4" : "application/x-mpegURL"}
      />
    )
  }

  const renderSubtitle = (subtitle: Subtitle) => (
    <track
      key={subtitle.url}
      kind="captions"
      src={swapEpisodeUrlId(subtitle.url.replace("{f}", "vtt"))}
      srcLang={subtitle.language}
      label={subtitle.language === "ar" ? "العربية" : "English"}
      default={subtitle.language === "ar"}
    />
  )

  return (
    <div className="player text-black">
      <div data-vjs-player>
        <video
          ref={videoNode}
          id="video-js-player"
          className="video-js vjs-16-9"
          autoPlay
          controls
          playsInline
        >
          {videos.map(renderVideo)}
          {subtitles.map(renderSubtitle)}
        </video>
      </div>
    </div>
  )
}

export default Player
