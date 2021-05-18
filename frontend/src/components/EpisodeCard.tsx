import React, { FunctionComponent } from "react";

import { Episode } from "../core/interfaces/episode";
import NImage from "./NImage";
import PlayIcon from "../icons/PlayIcon";
import "../styles/EpisodeCard.scss";

export interface EpisodeCardProps {
  episode: Episode;
  seriesId: string | number;
  seasonId: string | number;
}

const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({
  seriesId,
  seasonId,
  episode,
}) => {
  const progress =
    episode.hits?.length > 0
      ? (episode.hits[0].playback_position / episode.hits[0].runtime) * 100
      : 0;

  return (
    <div
      onClick={() =>
        (window.location.pathname = `/series/${seriesId}/${seasonId}/${episode.index}/play`)
      }
      className="episode-card-container flex items-center mb-4 p-2 rounded-lg md:mb-6 hover:bg-gray-900"
    >
      <NImage
        className="relative h-20 w-32 mr-2 md:mr-4 md:h-32 md:w-48 flex items-center justify-center"
        style={{ minWidth: "12rem" }}
        src={episode.image}
      >
        <div className="episode-play-icon bg-white rounded-full">
          <PlayIcon />
        </div>
        <div className="absolute bottom-0 left-0 progress h-1 w-full overflow-hidden rounded bg-gray-900">
          <div className="h-full h-rainbow" style={{ width: `${progress}%` }} />
        </div>
      </NImage>
      <div style={{ maxHeight: "8rem", overflow: "hidden" }}>
        <div className="flex">
          <h4 className="text-base md:text-xl text-n-red">
            {episode.index + 1}
          </h4>
          <h4 className="ml-2 text-xs md:text-sm">{episode.name}</h4>
        </div>
        <p className="mt-1 text-xs font-thin opacity-75 md:text-xs">
          {episode.plot}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCard;
