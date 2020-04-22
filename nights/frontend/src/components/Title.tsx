import React, { FunctionComponent, useEffect } from "react"

import InfoIcon from "~icons/InfoIcon"
import PlusIcon from "~icons/PlusIcon"
import PlayIcon from "~icons/PlayIcon"

import "../styles/Title.scss"
import { Title } from "~core/interfaces/title"
import { Link } from "react-router-dom"
import { getImageUrl } from "~utils/common"

export interface TitleProps {
  title: Title
}

const Title: FunctionComponent<TitleProps> = ({ title }) => {
  const image = getImageUrl(title.image.url)
  const tmdbImage = image.replace("250v", "250tmdb")

  return (
    <Link
      draggable={false}
      to={`/title/${title.id}`}
      className="inline-block card-container px-1 ml-2 py-2 md:hover:bg-white text-xss cursor-pointer select-none"
    >
      <div className="hidden md:flex top-info mb-2 justify-end">
        <PlusIcon className="mr-3 card-container-slide-reveal transition-500" />
        <InfoIcon className="card-container-slide-reveal transition-200" />
      </div>
      <div
        className="bg-black w-20 h-32 md:w-40 md:h-56 font-light flex flex-col justify-between items-center"
        style={{
          backgroundImage: `url(${tmdbImage}), url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="m-1 bg-green-600 text-black rounded-sm px-1 self-start">
          {title.is_new ? (title.type === "s" ? "New Episodes" : "New") : ""}
        </div>
        <PlayIcon className="hidden md:block card-container-reveal" />
        <div className="self-stretch v-gradient">
          <h4 className="card-container-reveal self-start font-medium md:text-xs pl-1">
            {title.name}
          </h4>
          <div className="p-1 flex justify-between items-center self-stretch">
            <span>{new Date(title.released_at).getFullYear()}</span>
            <span>{title.rating}</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block bottom-info card-container-reveal text-black pt-2 font-thin">
        {title.genres
          .slice(0, 3)
          .map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1))
          .join(" • ")}
      </div>
    </Link>
  )
}

export default Title
