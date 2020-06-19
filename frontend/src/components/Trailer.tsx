import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { TitleDetail, ImageQuality } from "../core/interfaces/title";
import videojs from "video.js";

import { getImageUrl } from "../utils/common";
import { useTranslation } from "react-i18next";

interface TrailerProps {
  title: TitleDetail;
  className?: string;
  style?: {};
}

const Trailer: FunctionComponent<TrailerProps> = ({
  title,
  className,
  style,
}) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const [error, setError] = useState(false);

  const src = title?.trailers[0]?.url.replace("{f}", "mp4");
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900);

  useEffect(() => {
    const player = videojs(videoNode.current, {
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
      poster,
    });

    player.on("error", () => {
      setError(true);
    });

    return () => {
      player.dispose();
    };
  }, [src]);

  return !error ? (
    <div className={`${className}`} style={style}>
      <h2 className="mb-5 text-xl font-semibold">{t("trailer")}</h2>
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
          className="video-js relative inset-0"
          controls
          playsInline
        />
      </div>
    </div>
  ) : null;
};

export default Trailer;
