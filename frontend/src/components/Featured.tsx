import {
  Title as ITitle,
  ImageQuality,
  TitleDetail,
} from "~core/interfaces/title"
import React, { FunctionComponent, useState, useEffect } from "react"
import { FaStar, FaPlay, FaPlus, FaEye, FaCheck } from "react-icons/fa"
import { FiInfo } from "react-icons/fi"

import { useTranslation } from "react-i18next"
import { Link, Redirect } from "react-router-dom"

import { PrimaryButton, InfoIconButton } from "./common/Buttons"
import { joinTopics, getImageUrl } from "~utils/common"
import NImage from "./NImage"
import { useAuth } from "~context/auth-context"
import { addToMyList, removeFromMyList, checkMyList } from "~api/title"
import MyListButton from "./MyListButton"

export interface FeaturedProps {
  data: TitleDetail[]
}

const Featured: FunctionComponent<FeaturedProps> = ({ data }) => {
  const { t } = useTranslation()

  const FeaturedItem = ({
    className = "",
    title,
  }: {
    className?: string
    title: TitleDetail
  }) => {
    const image = getImageUrl(title.images[0]?.url, ImageQuality.h900)
    return (
      <Link to={`/title/${title.id}`}>
        <NImage
          className={`object-cover object-center rounded-lg relative text-sm font-light ${className}`}
          style={{ paddingTop: "60%", width: "20rem" }}
          src={image}
        >
          <h4 className="absolute bottom-0 right-0 left-0 px-3 pb-4 v-gradient-88 text-lg font-semibold">
            {title.name}
          </h4>
        </NImage>
      </Link>
    )
  }

  const BottomInfo = () => {
    const title = data[0]

    return (
      <div className="p-10 absolute bottom-0 left-0 right-0 v-gradient flex justify-between items-center">
        <div className="mr-2">
          <div className="flex items-center font-bold mb-1">
            {title.rating && (
              <p className="flex items-center mr-6">
                <FaStar className="text-n-blue mr-1" fontSize=".55em" />
                {title.rating.toFixed(1)}
              </p>
            )}
            {title.type === "s" ? (
              <p className="mr-6">
                {title.seasons?.length} Season
                {title.seasons?.length > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="mr-6">{Math.floor(title.runtime / 60)} mins</p>
            )}
            <p>{new Date(title.released_at).getFullYear()}</p>
          </div>
          <Link to={`/title/${title.id}`}>
            <h1 className="text-xl md:text-5xl font-bold mb-1 leading-none">
              {title?.name}
            </h1>
          </Link>
          <p className="mb-1 opacity-75">{joinTopics(data[0]?.genres)}</p>
          <div className="flex items-center text-sm md:text-base">
            <p className="mr-6 opacity-75">{data[0].rated}</p>
            <p className="flex items-center">
              <FaEye className="mr-2 text-xs text-n-blue" />
              <span className="opacity-75">{data[0].views}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <PrimaryButton
            className="md:mr-8"
            to={
              title.type === "m"
                ? `/movie/${title.id}/play`
                : `/series/${title.id}/auto/auto/play`
            }
          >
            <FaPlay className="mr-3" size="1.5em" />
            {t("play")}
          </PrimaryButton>
          <MyListButton className="mr-8" id={title.id} />
          <InfoIconButton
            className="hidden md:flex"
            to={`/title/${data[0].id}`}
            icon={<FiInfo className="text-xl" />}
          >
            {t("info")}
          </InfoIconButton>
        </div>
      </div>
    )
  }

  const image = getImageUrl(data[0]?.images[0]?.url, ImageQuality.h900)

  return (
    <div className="flex mb-10">
      <NImage
        className="relative object-cover object-center h-64 md:h-auto flex-1 rounded-lg md:mr-8"
        style={{ paddingTop: "35%" }}
        src={image}
      >
        <BottomInfo />
      </NImage>
      <div className="hidden md:block">
        <FeaturedItem className="mb-8" title={data[1]} />
        <FeaturedItem className="mb-8" title={data[2]} />
        <FeaturedItem title={data[3]} />
      </div>
    </div>
  )
}

export default Featured
