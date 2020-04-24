import React, { FunctionComponent } from "react"

import { ViewHit } from "~core/interfaces/view-hit"
import "../styles/CWCard.scss"
import { getImageUrl } from "~utils/common"

import NImage from "./NImage"

export interface CWCardProps {
  hit: ViewHit
}

const CWCard: FunctionComponent<CWCardProps> = ({ hit }) => {
  const percent = (hit.playback_position / hit.runtime) * 100
  return (
    <div className="cw-card-container flex pt-2 md:pt-8 ml-3 mr-2 cursor-pointer">
      <NImage
        className="glow w-32 h-20 object-cover rounded mr-2"
        draggable={false}
        src={getImageUrl(hit.topic?.images[0]?.url)}
      />
      <div className="flex flex-col flex-1 justify-between">
        <p className="text-sm">{hit.topic.name}</p>
        <p>{hit.episode?.name}</p>
        <div className="progress h-1 overflow-hidden rounded bg-gray-900">
          <div className="h-full h-rainbow" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  )
}

export default CWCard
