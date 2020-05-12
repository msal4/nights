import React, { FunctionComponent } from "react"
import Carousel, { ResponsiveType } from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

export const defaultResponsive = {
  desktop: {
    breakpoint: { max: 6000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 3,
  },
}

export interface CarouselRowProps {
  title: string
  className?: string
  responsive?: ResponsiveType
}

const CarouselRow: FunctionComponent<CarouselRowProps> = ({
  title,
  children,
  className = "",
  responsive = {},
}) => {
  return (
    <div className={`relative ${className}`}>
      <h3 className="ml-3 md:absolute md:text-lg text-sm font-semibold leading-none">
        {title}
      </h3>
      <Carousel
        className="carousel-row"
        responsive={{ ...defaultResponsive, ...responsive }}
      >
        {children}
      </Carousel>
    </div>
  )
}

export default CarouselRow
