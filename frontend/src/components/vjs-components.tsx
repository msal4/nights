import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { IoIosClose, IoIosAlbums } from "react-icons/io";
import { FiSkipForward } from "react-icons/fi";
import ForwardIcon from "../icons/ForwardIcon";
import BackwardIcon from "../icons/BackwardIcon";
import { useTranslation } from "react-i18next";

export const vjsComponent = videojs.getComponent("Component");

export interface PlayerTitleBarOptions extends VideoJsPlayerOptions {
  goBack: () => void;
  title: string;
  displaySidebar: boolean;
}

export class vjsTitleBar extends vjsComponent {
  goBack: () => void;
  title: string;
  displaySidebar: boolean = false;

  constructor(player: VideoJsPlayer, options: PlayerTitleBarOptions) {
    super(player, options);

    this.mount = this.mount.bind(this);
    this.goBack = options.goBack;
    this.title = options.title;
    this.displaySidebar = options.displaySidebar;

    player.ready(() => {
      this.mount();
    });

    this.on("dispose", () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <div
        className="vjs-title-bar p-5 absolute top-0 left-0 right-0 v-gradient-inverse flex items-center justify-between opacity-0 transition-opacity duration-700"
        style={{ zIndex: 1 }}
      >
        <CloseButton onClick={this.goBack} />
        <h2 className="text-xl">{this.title}</h2>
        {(this.displaySidebar && <SidebarButton player={this.player()} />) || (
          <div />
        )}
      </div>,
      this.el()
    );
  }
}

export const SidebarButton = ({ player }: { player: VideoJsPlayer }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!visible);
  const { t } = useTranslation();

  player.on("togglesidebar", toggleVisible);

  return (
    <button
      onClick={() => {
        player.trigger("togglesidebar");
      }}
    >
      <IoIosAlbums
        className={`block transition-color duration-500 text-3xl ${visible ? "text-n-red" : ""
          }`}
      />
    </button>
  );
};

export class vjsForwardBackwardButtons extends vjsComponent {
  constructor(player: VideoJsPlayer, options: PlayerTitleBarOptions) {
    super(player, options);

    this.mount = this.mount.bind(this);

    player.ready(() => {
      this.mount();
    });

    this.on("dispose", () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    const seek = (seekTime = 10) => {
      let time = this.player().currentTime() + seekTime;

      if (time < 0) {
        time = 0;
      }

      this.player().currentTime(time);
    };
    ReactDOM.render(
      <div className="flex items-center h-full">
        <button
          className="vjs-forward-backward-button"
          style={{
            width: "3rem",
            height: "3rem",
            marginRight: "1rem",
            marginTop: "-1rem",
          }}
          onClick={() => seek(-10)}
        >
          <BackwardIcon width="1.8rem" height="1.8rem" />
        </button>
        <button
          className="vjs-forward-backward-button"
          style={{
            width: "3rem",
            height: "3rem",
            marginTop: "-1rem",
          }}
          onClick={() => seek()}
        >
          <ForwardIcon width="1.8rem" height="1.8rem" />
        </button>
      </div>,
      this.el()
    );
  }
}

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>
    <IoIosClose className="text-5xl" />
  </button>
);
