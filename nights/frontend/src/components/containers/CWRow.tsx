import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

import CarouselRow from "../CarouselRow"
import { ViewHit } from "~core/interfaces/view-hit"
import CWCard from "~components/containers/CWCard"

export interface TitleRowProps {
  row: ViewHit[]
}

const CWRow: FunctionComponent<TitleRowProps> = ({ row }) => {
  const { t } = useTranslation()

  return (
    <CarouselRow
      className="pb-6"
      title={t("continueWatching")}
      responsive={{
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 3,
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
      }}
    >
      {row.map((hit) => (
        <CWCard key={hit.id} hit={hit} />
      ))}
    </CarouselRow>
  )
}

export default CWRow
