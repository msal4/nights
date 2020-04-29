import React, { FunctionComponent } from "react"

import NImage from "./NImage"
import PlayIcon from "~icons/PlayIcon"
import "../styles/ProgressCard.scss"
import { Link } from "react-router-dom"

export interface ProgressCardProps {
  progress: number
  imageUrl: string
  name: string
  path: string
}

const ProgressCard: FunctionComponent<ProgressCardProps> = ({
  progress,
  imageUrl,
  name,
  path,
}) => {
  return (
    <Link
      to={path}
      className="cw-card-container flex pt-2 md:pt-8 ml-3 mr-2 cursor-pointer"
    >
      <NImage
        className="glow w-32 h-20 object-cover rounded mr-2 flex items-center justify-center"
        draggable={false}
        src={imageUrl}
      >
        <PlayIcon className="play-icon transition-opacity duration-200" />
      </NImage>
      <div className="flex flex-col flex-1 justify-between">
        <p className="text-sm">{name}</p>
        <div className="progress h-1 overflow-hidden rounded bg-gray-900">
          <div className="h-full h-rainbow" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Link>
  )
}

export default ProgressCard
