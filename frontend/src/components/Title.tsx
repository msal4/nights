import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { FaCheck, FaPlus } from "react-icons/fa";

import "../styles/Title.scss";
import PlayIcon from "../icons/PlayIcon";
import { Title as ITitle } from "../core/interfaces/title";
import { getImageUrl } from "../utils/common";
import { addToMyList, removeFromMyList, checkMyList } from "../api/title";
import { useAuth } from "../context/auth-context";

export interface TitleProps {
  title: ITitle;
}

const Title: FunctionComponent<TitleProps> = ({ title }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [inMyList, setInMyList] = useState(false);
  const [redirect, setRedirect] = useState(false);

  if (redirect) return <Redirect to="/login" />;

  const image = getImageUrl(title.images[0]?.url);
  const tmdbImage = image?.replace("250v", "250tmdb");

  return (
    <div
      className="relative inline-block card-container px-1 ml-2 py-2 md:hover:bg-white text-xs cursor-pointer select-none"
      onMouseEnter={async () => {
        if (!token) return;
        try {
          await checkMyList(title.id);
          setInMyList(true);
        } catch (err) {
          setInMyList(false);
        }
      }}
      // onMouseLeave={}
    >
      <div className="hidden md:flex top-info mb-2 justify-end">
        {!inMyList ? (
          <FaPlus
            style={{ zIndex: 2 }}
            className="mr-3 text-xss text-black card-container-slide-reveal transition-500"
            onClick={async () => {
              if (!token) return setRedirect(true);
              try {
                await addToMyList(title.id);
                setInMyList(true);
              } catch (err) {
                console.log(err);
              }
            }}
          />
        ) : (
          <FaCheck
            style={{ zIndex: 2 }}
            fontSize=".5rem"
            className="text-black text-xss mr-3 card-container-slide-reveal transition-500"
            onClick={async () => {
              if (!token) return setRedirect(true);
              try {
                await removeFromMyList(title.id);
                setInMyList(false);
              } catch (err) {
                console.log(err);
              }
            }}
          />
        )}
        <Link to={`/title/${title.id}`}>
          <FiInfo className="text-black text-xss card-container-slide-reveal transition-200" />
        </Link>
      </div>
      <Link
        className="absolute inset-0"
        to={`/title/${title.id}`}
        style={{ zIndex: 1 }}
      />
      <div
        className="title-poster block relative bg-black font-light"
        style={{
          backgroundImage: `url(${tmdbImage}), url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <span className="absolute inset-0 w-full h-full flex flex-col justify-between items-center">
          <span className="m-1 bg-green-600 text-black rounded-sm px-1 self-start">
            {title.is_new && (title.type === "s" ? t("newEpisodes") : t("new"))}
          </span>
          <Link
            draggable={false}
            to={
              title.type === "s"
                ? `/series/${title.id}/auto/auto/play`
                : `/movie/${title.id}/play`
            }
            style={{ zIndex: 2 }}
          >
            <PlayIcon className="hidden md:block card-container-reveal" />
          </Link>
          <div className="self-stretch v-gradient pt-4">
            <h4 className="card-container-reveal self-start font-medium md:text-sm pl-1">
              {title.name}
            </h4>
            <div className="p-1 flex justify-between items-center self-stretch">
              <span>
                {title.runtime
                  ? Math.floor(title.runtime / 60) + " min"
                  : title.rated}
              </span>
              <span>{title.rating}</span>
            </div>
          </div>
        </span>
      </div>
      <div className="hidden md:block bottom-info card-container-reveal text-black pt-2 font-thin">
        {title.genres
          .slice(0, 3)
          .map(g => g.name.charAt(0).toUpperCase() + g.name.slice(1))
          .join(" • ")}
      </div>
    </div>
  );
};

export default Title;
