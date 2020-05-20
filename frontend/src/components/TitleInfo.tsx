import React, { FunctionComponent } from "react"
import { TitleDetail } from "~core/interfaces/title"
import { useTranslation } from "react-i18next"
import { IoIosEye, IoIosStar } from "react-icons/io"

export interface TitleInfoProps {
  title: TitleDetail
}

const TitleInfo: FunctionComponent<TitleInfoProps> = ({ title }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="mb-2 font-bold">{t("plot")}</h2>
      <p className="mb-2 opacity-50 text-sm">{title.plot}</p>
      <div className="mb-4 flex items-center font-thin">
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
        <div className="flex items-center">
          <h4 className="mr-4 opacity-50">{t("runtime")}</h4>
          <p>{Math.round(title.runtime / 60)} mins</p>
        </div>
      )}
    </div>
  )
}

export default TitleInfo
