import React, { FunctionComponent } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import Title from "~components/Title"
import "../styles/TitleRow.scss"
import { GenreRow } from "~core/interfaces/home"

export interface TitleRowProps {
  row: GenreRow
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 15,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  midTablet: {
    breakpoint: { max: 750, min: 540 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
}

const TitleRow: FunctionComponent<TitleRowProps> = ({ row }) => {
  return (
    <div className="relative">
      <h3 className="md:absolute md:text-lg text-sm ml-3 font-semibold leading-none">
        {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
      </h3>
      <Carousel className="py-2 md:py-3" responsive={responsive}>
        {row.title_list.map((t) => (
          <Title key={t.id} title={t} />
        ))}
      </Carousel>
    </div>
  )
}

export default TitleRow
