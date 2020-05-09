import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { IoIosClose, IoIosAlbums } from "react-icons/io"

export const vjsComponent = videojs.getComponent("Component")

export interface PlayerTitleBarOptions extends VideoJsPlayerOptions {
  goBack: () => void
  title: string
  displaySidebar: boolean
}

export class vjsTitleBar extends vjsComponent {
  goBack: () => void = null
  title: string
  displaySidebar: boolean = false

  constructor(player: VideoJsPlayer, options: PlayerTitleBarOptions) {
    super(player, options)

    this.mount = this.mount.bind(this)
    this.goBack = options.goBack
    this.title = options.title
    this.displaySidebar = options.displaySidebar

    player.ready(() => {
      this.mount()
    })

    this.on("dispose", () => {
      ReactDOM.unmountComponentAtNode(this.el())
    })
  }

  mount() {
    ReactDOM.render(
      <div className="vjs-title-bar p-5 absolute top-0 left-0 right-0 v-gradient-inverse flex items-center justify-between opacity-0 transition-opacity duration-700">
        <CloseButton onClick={this.goBack} />
        <h2 className="text-xl">{this.title}</h2>
        {(this.displaySidebar && <SidebarButton player={this.player()} />) || (
          <div />
        )}
      </div>,
      this.el()
    )
  }
}

export const SidebarButton = ({ player }: { player: VideoJsPlayer }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible(!visible)

  player.on("togglesidebar", toggleVisible)

  return (
    <button
      className="opacity-0 w-0 md:opacity-100 md:w-auto"
      onClick={() => {
        player.trigger("togglesidebar")
      }}
    >
      <IoIosAlbums
        className={`transition-color duration-500 text-3xl ${
          visible ? "text-n-red" : ""
        }`}
      />
    </button>
  )
}

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>
    <IoIosClose className="text-5xl" />
  </button>
)
