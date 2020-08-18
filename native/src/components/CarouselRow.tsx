import React, { FunctionComponent } from "react";
import Carousel, { ResponsiveType } from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { IoIosArrowForward } from "react-icons/io";
import { useTranslation } from "react-i18next";

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
};

export interface CarouselRowProps {
  title: string;
  path: string;
  className?: string;
  responsive?: ResponsiveType;
}

const CarouselRow: FunctionComponent<CarouselRowProps> = ({
  title,
  children,
  path,
  className = "",
  responsive = {},
}) => {
  const { t } = useTranslation();
  return (
    <div className={`relative ${className}`}>
      <div className="md:pb-10 ml-3 z-10 w-full md:absolute md:text-lg text-sm font-semibold leading-none flex items-center justify-between">
        {path ? <Link to={path}>{title}</Link> : <span>{title}</span>}
        {path && (
          <Link
            to={path}
            className="flex items-center font-thin text-sm mr-8 hover:text-n-red"
          >
            {t("seeMore")} <IoIosArrowForward className="text-xss text-n-red" />
          </Link>
        )}
      </div>
      <Carousel
        className="carousel-row"
        responsive={{ ...defaultResponsive, ...responsive }}
        infinite
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CarouselRow;
