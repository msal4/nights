import React, { FunctionComponent, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import { History } from "history";

import "video.js/src/css/video-js.scss";
import "../styles/Player.scss";
import { Video, Subtitle } from "../core/interfaces/topic";
import { TitleDetail } from "../core/interfaces/title";
import { swapEpisodeUrlId } from "../utils/common";
import {
  vjsComponent,
  vjsTitleBar,
  vjsForwardBackwardButtons,
} from "./vjs-components";
import PlayerSidebar from "./PlayerSidebar";
import { useDisposableEffect } from "../hooks";
import ScrollToTop from "./ScrollToTop";

// Register videojs components
vjsComponent.registerComponent("vjsTitleBar", vjsTitleBar);
vjsComponent.registerComponent(
  "vjsForwardBackwardButtons",
  vjsForwardBackwardButtons
);

const getVideoUrl = (video: Video) => {
  const format = video.formats.split(",")[0] || "mp4";
  // Shift the id before the season index for legacy reasons
  const url = swapEpisodeUrlId(
    video.url.replace("{q}", "720").replace("{f}", format)
  );
  return { url, format };
};

type OnUpdatePositionCallback = (
  position: number,
  duration: number
) => void | Promise<void>;

export interface PlayerProps {
  name: string;
  history: History;
  title: TitleDetail;
  videos: Video[];
  subtitles: Subtitle[];
  poster: string;
  position: number;
  onUpdatePosition?: OnUpdatePositionCallback;
  displaySidebar?: boolean;
  onFinish?: VoidFunction;
}

const Player: FunctionComponent<PlayerProps> = ({
  name,
  history,
  title,
  videos,
  subtitles,
  poster,
  onUpdatePosition,
  position = 0,
  displaySidebar = false,
  onFinish,
}) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useDisposableEffect((disposed) => {
    const player = videojs(videoNode.current, {
      sources: videos.map((video) => {
        const { format, url } = getVideoUrl(video);
        return {
          src: url,
          type: format === "mp4" ? "video/mp4" : "application/x-mpegURL",
        } as videojs.Tech.SourceObject;
      }),
      tracks: subtitles.map(
        (subtitle) =>
          ({
            kind: "captions",
            src: swapEpisodeUrlId(subtitle.url.replace("{f}", "vtt")),
            srcLang: subtitle.language,
            label: subtitle.language === "ar" ? "العربية" : "English",
            default: subtitle.language === "ar",
          } as videojs.Tech.SourceObject)
      ),
    });

    try {
      // Set the current time from view hit
      player.currentTime(position);

      // Update the position for the parent to handle it
      player.on(
        "timeupdate",
        () =>
          !disposed &&
          onUpdatePosition &&
          handleTimeUpdate(player, position, onUpdatePosition)
      );

      // Toggle sidebar
      player.on(
        "togglesidebar",
        () => !disposed && setShowSidebar((showSidebar) => !showSidebar)
      );

      onFinish && player.on("ended", onFinish);

      // Add title bar
      player.addChild("vjsTitleBar", {
        title: name,
        goBack: () => history.push(`/title/${title.id}`),
        displaySidebar,
      });
      player
        .getChild("ControlBar")
        ?.addChild("vjsForwardBackwardButtons")
        .addClass("vjs-forward-backward-buttons");

      // Check if the device is running ios
      if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform))
        throw Error("iOS Fullcreen is not supported.");

      const disposeFullscreenButton = replaceFullscreenButton(
        videoContainerRef,
        player
      );

      return () => {
        disposeFullscreenButton && disposeFullscreenButton();
        player.dispose();
      };
    } catch (err) {
      console.log(err);
      return () => player.dispose();
    }
  }, []);

  return (
    <div
      ref={videoContainerRef}
      className="absolute inset-0 z-10 overflow-hidden player text-black"
    >
      <ScrollToTop />
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
  );
};

const handleTimeUpdate = (
  player: VideoJsPlayer,
  position: number,
  onUpdatePosition: OnUpdatePositionCallback
) => {
  const currentPosition = Math.floor(player.currentTime());
  // Check if the player seeked over 30 secs or the user is seeking back
  if (currentPosition > position + 30 || currentPosition < position) {
    // Update the position
    const duration = Math.floor(player.duration());
    position = currentPosition;

    onUpdatePosition && position && onUpdatePosition(position, duration);
  }
};

const replaceFullscreenButton = (
  ref: React.RefObject<HTMLDivElement> | null,
  player: VideoJsPlayer
) => {
  const el = videojs.dom.$(".vjs-fullscreen-control")?.cloneNode(true);
  if (!el) return;

  let isFullscreen = false;

  if (ref && ref.current)
    ref.current.onfullscreenchange = (_) => {
      isFullscreen = !isFullscreen;
    };

  const toggleFullscreen = () => {
    if (isFullscreen) document.exitFullscreen();
    else ref?.current?.requestFullscreen();
  };

  videojs.dom.$(".vjs-fullscreen-control").replaceWith(el);
  el.addEventListener("click", toggleFullscreen);

  player.ready(function () {
    (player as any).tech_.off("dblclick");
  });

  player.on("dblclick", toggleFullscreen);

  return () => el.removeEventListener("click", toggleFullscreen);
};

export default Player;
