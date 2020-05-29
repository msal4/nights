import React, { FunctionComponent } from "react"
import { IoIosPlay } from "react-icons/io"
import { useTranslation } from "react-i18next"
import { FiInfo } from "react-icons/fi"
import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"

import { ImageQuality, TitleDetail } from "../core/interfaces/title"
import { joinTopics, getImageUrl } from "../utils/common"
import NImage from "./NImage"
import { PrimaryButton, InfoIconButton } from "./common/Buttons"
import MyListButton from "./MyListButton"
import PlayButton from "./PlayButton"

export interface RecommendedProps {
  title?: TitleDetail
}

const Recommended: FunctionComponent<RecommendedProps> = ({ title }) => {
  const { t } = useTranslation()

  const image = getImageUrl(title?.images[0]?.url, ImageQuality.h900)
  return (
    <div className="mb-8 mx-3">
      <h3
        className="md:text-lg text-sm font-semibold leading-none"
        style={{ marginBottom: "3vw" }}
      >
        {t("pickedForYou")}
      </h3>
      <div className="flex flex-col md:flex-row">
        <Link
          to={`/title/${title?.id}`}
          className="relative rounded-lg mb-2 w-full flex-1 md:mr-4 md:h-full"
          style={{ paddingTop: "30%" }}
        >
          <NImage className="absolute inset-0" src={image} />
        </Link>
        <div className="flex flex-col md:flex-1 md:justify-between md:mt-2">
          <div className="flex flex-col items-start">
            <div className="bg-green-600 text-black text-xss rounded-sm px-1 mb-2 self-start">
              {title?.is_new
                ? title.type === "s"
                  ? "New Episodes"
                  : "New"
                : ""}
            </div>
            <Link
              to={`/title/${title?.id}`}
              className="md:text-4xl md:font-bold"
            >
              {title?.name}
            </Link>
            <p className="mb-4 opacity-75">{joinTopics(title?.genres)}</p>
            <div className="flex items-center font-bold mb-4">
              {title?.rating && (
                <p className="flex items-center mr-6">
                  <FaStar className="text-n-blue mr-1" fontSize=".55em" />
                  {title?.rating.toFixed(1)}
                </p>
              )}
              {title &&
                (title?.type === "s" ? (
                  <p className="mr-6">
                    {title.seasons?.length} Season
                    {title.seasons?.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="mr-6">{Math.floor(title.runtime / 60)} mins</p>
                ))}
              {title && <p>{new Date(title.released_at).getFullYear()}</p>}
            </div>

            <p className="opacity-50 text-sm mb-4 max-w-lg">{title?.plot}</p>
          </div>

          <div className="flex items-center mb-2 md:mb-4">
            {title && <PlayButton title={title} />}
            <MyListButton className="mr-8" id={title?.id || ""} />
            <InfoIconButton
              className="hidden md:flex"
              to={`/title/${title?.id}`}
              icon={<FiInfo className="text-xl" />}
            >
              {t("info")}
            </InfoIconButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommended
