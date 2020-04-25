import React, { FunctionComponent } from "react"

import { ViewHit } from "~core/interfaces/view-hit"
import { getImageUrl } from "~utils/common"
import ProgressCard from "~components/ProgressCard"

export interface CWCardProps {
  hit: ViewHit
}

const CWCard: FunctionComponent<CWCardProps> = ({ hit }) => {
  return (
    <ProgressCard
      progress={(hit.playback_position / hit.runtime) * 100}
      imageUrl={getImageUrl(hit.topic?.images[0]?.url)}
      name={hit.topic.type === "s" ? hit.episode?.name : hit.topic.name}
    />
  )
}

export default CWCard
