import React, { FunctionComponent } from "react"
import { TitleDetail } from "../core/interfaces/title"
import { useTranslation } from "react-i18next"
import { IoIosEye, IoIosStar } from "react-icons/io"
import { Link } from "react-router-dom"

export interface TitleInfoProps {
  title: TitleDetail
}

const TitleInfo: FunctionComponent<TitleInfoProps> = ({ title }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="font-bold">{t("plot")}</h2>
      <p className="mt-4 opacity-50 text-sm">{title.plot}</p>
      <div className="mt-4 flex items-center font-thin">
        <span className="mr-4">{title.rated}</span>
        {title.type === "m" && (
          <div className="flex items-center mr-4">
            <IoIosEye className="text-n-blue mr-2" size="1em" />
            {title.views}
          </div>
        )}
        <div className="flex items-center">
          <IoIosStar className="text-n-blue mr-2" size="1em" />
          {title.rating}
        </div>
      </div>
      {title.type === "m" && (
        <div className="mt-4 flex items-center">
          <h4 className="mr-4 opacity-50">{t("runtime")}</h4>
          <p>{Math.round(title.runtime / 60)} mins</p>
        </div>
      )}
      <div className="mt-4 flex items-center">
        <h4 className="mr-4 opacity-50">{t("releaseDate")}</h4>
        <p>{new Date(title.released_at).toLocaleDateString()}</p>
      </div>
      <div className="mt-4 flex">
        <h4 className="mr-4 opacity-50">{t("cast")}</h4>
        <p>
          {title.cast.map(actor => (
            <Link
              key={actor.id}
              className="mr-4 hover:text-blue-500"
              to={`/search?cast=${actor.id}`}
            >
              {actor.name}
            </Link>
          ))}
        </p>
      </div>
    </div>
  )
}

export default TitleInfo
