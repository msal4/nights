import React, { FunctionComponent, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, Redirect, useLocation } from "react-router-dom"

import InfoIcon from "~icons/InfoIcon"
import PlusIcon from "~icons/PlusIcon"
import PlayIcon from "~icons/PlayIcon"

import { Title } from "~core/interfaces/title"
import { getImageUrl } from "~utils/common"
import "../styles/Title.scss"
import { addToMyList, removeFromMyList, checkMyList } from "~api/title"
import { useAuth } from "~context/auth-context"

import { FiCheck } from "react-icons/fi"

export interface TitleProps {
  title: Title
}

const Title: FunctionComponent<TitleProps> = ({ title }) => {
  const { t } = useTranslation()
  const { token } = useAuth()
  const [inMyList, setInMyList] = useState(false)
  const [redirect, setRedirect] = useState(false)

  if (redirect) return <Redirect to="/login" />

  const image = getImageUrl(title.images[0]?.url)
  const tmdbImage = image.replace("250v", "250tmdb")

  return (
    <div
      className="inline-block card-container px-1 ml-2 py-2 md:hover:bg-white text-xss cursor-pointer select-none"
      onMouseEnter={async () => {
        if (!token) return
        try {
          await checkMyList(title.id)
          setInMyList(true)
        } catch (err) {
          setInMyList(false)
        }
      }}
      // onMouseLeave={}
    >
      <div className="hidden md:flex top-info mb-2 justify-end">
        {!inMyList ? (
          <PlusIcon
            className="mr-3 card-container-slide-reveal transition-500"
            onClick={async () => {
              !token && setRedirect(true)
              try {
                await addToMyList(title.id)
                setInMyList(true)
              } catch (err) {
                console.log(err)
              }
            }}
          />
        ) : (
          <FiCheck
            fontSize=".5rem"
            className="text-black mr-3 card-container-slide-reveal transition-500"
            onClick={async () => {
              !token && setRedirect(true)
              try {
                await removeFromMyList(title.id)
                setInMyList(false)
              } catch (err) {
                console.log(err)
              }
            }}
          />
        )}
        <Link to={`/title/${title.id}`}>
          <InfoIcon className="card-container-slide-reveal transition-200" />
        </Link>
      </div>
      <Link
        draggable={false}
        to={
          title.type === "s"
            ? `/series/${title.id}/auto/auto/play`
            : `/movie/${title.id}/play`
        }
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
          <PlayIcon className="hidden md:block card-container-reveal" />
          <div className="self-stretch v-gradient">
            <h4 className="card-container-reveal self-start font-medium md:text-xs pl-1">
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
      </Link>
      <div className="hidden md:block bottom-info card-container-reveal text-black pt-2 font-thin">
        {title.genres
          .slice(0, 3)
          .map(g => g.name.charAt(0).toUpperCase() + g.name.slice(1))
          .join(" • ")}
      </div>
    </div>
  )
}

export default Title
