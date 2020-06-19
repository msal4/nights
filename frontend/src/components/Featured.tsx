import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { FunctionComponent, useState } from "react";
import { FaStar, FaEye } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

import { ImageQuality, TitleDetail } from "../core/interfaces/title";
import { InfoIconButton } from "./common/Buttons";
import { joinTopics, getImageUrl } from "../utils/common";
import NImage from "./NImage";
import MyListButton from "./MyListButton";
import { useBackground } from "../context/background-context";
import PlayButton from "./PlayButton";

export interface FeaturedProps {
  data: TitleDetail[];
}

const Featured: FunctionComponent<FeaturedProps> = ({ data }) => {
  const { t } = useTranslation();
  const [titles, setTitles] = useState<TitleDetail[]>(data);
  const { changeBackground } = useBackground();

  const FeaturedItem = ({
    className = "",
    index,
    title,
  }: {
    className?: string;
    index: number;
    title: TitleDetail;
  }) => {
    const image = getImageUrl(title?.images[0]?.url, ImageQuality.h900);
    return (
      <div
        className="cursor-pointer"
        onClick={(e) => {
          setTitles([
            title,
            ...titles.slice(1, index),
            titles[0],
            ...titles.slice(index + 1),
          ]);
        }}
      >
        <NImage
          className={`object-cover object-center rounded-lg relative text-sm font-light ${className}`}
          style={{ paddingTop: "60%", width: "20rem" }}
          src={image}
        >
          <h4 className="absolute bottom-0 right-0 left-0 px-3 pb-4 v-gradient-88 text-lg font-semibold">
            {title?.name}
          </h4>
        </NImage>
      </div>
    );
  };

  const BottomInfo = ({ title }: { title: TitleDetail }) => {
    if (!title) return null;

    return (
      <div className="p-10 absolute bottom-0 left-0 right-0 v-gradient flex justify-between items-center">
        <div className="mr-2">
          {title.is_new && (
            <span className="bg-green-600 text-xs text-black rounded-sm px-1">
              (title.type === "s" ? t("newEpisodes") : t("new"))
            </span>
          )}
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
            <h1 className="text-xl md:text-4xl font-bold mb-1 leading-none">
              {title?.name}
            </h1>
          </Link>
          <p className="mb-1 opacity-75">{joinTopics(title?.genres)}</p>
          <div className="flex items-center text-sm md:text-base">
            <p className="mr-6 opacity-75">{title.rated}</p>
            <p className="flex items-center">
              <FaEye className="mr-2 text-xs text-n-blue" />
              <span className="opacity-75">{title.views}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <PlayButton title={title} />
          <MyListButton className="mr-8" id={title?.id} />
          <InfoIconButton
            className="hidden md:flex"
            to={`/title/${title.id}`}
            icon={<FiInfo className="text-xl" />}
          >
            {t("info")}
          </InfoIconButton>
        </div>
      </div>
    );
  };

  const image = getImageUrl(titles[0]?.images[0]?.url, ImageQuality.h900);
  changeBackground(titles[0]);

  return (
    <div className="flex mb-10">
      <NImage
        className="relative object-cover object-center h-64 md:h-auto flex-1 rounded-lg md:mr-8"
        style={{ paddingTop: "35%" }}
        src={image}
      >
        <BottomInfo title={titles[0]} />
      </NImage>
      <div className="hidden md:block">
        <FeaturedItem className="mb-8" index={1} title={titles[1]} />
        <FeaturedItem className="mb-8" index={2} title={titles[2]} />
        <FeaturedItem index={3} title={titles[3]} />
      </div>
    </div>
  );
};

export default Featured;
