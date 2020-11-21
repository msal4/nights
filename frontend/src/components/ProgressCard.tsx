import React, { FunctionComponent } from "react"
import { Link } from "react-router-dom"

import NImage from "./NImage"
import PlayIcon from "../icons/PlayIcon"
import "../styles/ProgressCard.scss"

export interface ProgressCardProps {
  progress: number
  imageUrl: string
  name: string
  titlePath: string
  path: string
  playbackPosition?: number
  runtime?: number
}

const ProgressCard: FunctionComponent<ProgressCardProps> = ({
  progress,
  imageUrl,
  name,
  titlePath,
  path,
  playbackPosition,
  runtime,
}) => {
  return (
    <div className="cw-card-container flex pt-2 md:pt-8 ml-3 mr-2 cursor-pointer">
      <Link to={path}>
        <NImage
          className="w-32 h-20 object-cover rounded mr-4 flex items-center justify-center"
          draggable={false}
          src={imageUrl}
        >
          <PlayIcon className="play-icon transition-opacity duration-200" />
        </NImage>
      </Link>
      <Link to={titlePath} className="flex flex-col flex-1 justify-between">
        <p className="name transition-all duration-200 text-sm">{name}</p>
        {runtime && playbackPosition && (
          <p className="secondary-info text-sm transition-opacity duration-200">
            {Math.round(playbackPosition / 60)} / {Math.round(runtime / 60)}{" "}
            mins
          </p>
        )}
        <div className="progress h-1 overflow-hidden rounded bg-gray-900">
          <div className="h-full h-rainbow" style={{ width: `${progress}%` }} />
        </div>
      </Link>
    </div>
  )
}

export default ProgressCard