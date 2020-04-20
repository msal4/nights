import React, { FunctionComponent } from "react"
import { Title } from "~core/interfaces/title"
import { joinTopics } from "~utils/common"
import {
  IoIosStar,
  IoIosPlay,
  IoIosInformationCircleOutline,
  IoIosAdd,
} from "react-icons/io"
import { PrimaryButton, InfoIconButton } from "./Buttons"
import { useTranslation } from "react-i18next"

export interface RecommendedProps {
  title?: Title
}

const Recommended: FunctionComponent<RecommendedProps> = ({ title }) => {
  const { t } = useTranslation()

  return (
    <div className="mb-8 mx-3">
      <h3 className="md:text-lg mb-6 text-sm font-semibold leading-none">
        Picked for You
      </h3>
      <div className="flex flex-col md:flex-row">
        <div className="rounded-lg mb-2 w-full h-40 md:w-0 flex-1 h-full md:mr-4">
          <img
            className="h-full w-full object-cover"
            src="/static/frontend/images/mulan.png"
            alt=""
          />
        </div>
        <div className="flex flex-col md:flex-1 md:justify-between md:mt-2">
          <div className="flex flex-col items-start">
            <div className="bg-green-600 text-black text-xss rounded-sm px-1 mb-2 self-start">
              {title.is_new
                ? title.type === "s"
                  ? "New Episodes"
                  : "New"
                : ""}
            </div>
            <h1 className="md:text-2xl md:font-thin mb-2 md:mb-4">
              {title.name}
            </h1>
            <div className="flex items-center text-xs md:text-sm mb-2 md:mb-4">
              <p className="text-gray-500 mr-2">{joinTopics(title.genres)}</p>
              <p className="flex items-center text-white font-semibold">
                <IoIosStar className="text-blue-600 mr-1" size="1em" />
                {title.rating}
              </p>
            </div>
          </div>

          <div className="flex items-center mb-2 md:mb-4">
            <PrimaryButton className="mr-4" to="/series/play">
              <IoIosPlay size="1.5em" />
              {t("play")}
            </PrimaryButton>
            <InfoIconButton
              className="mr-4"
              icon={<IoIosAdd className="text-base" />}
            >
              {t("myList")}
            </InfoIconButton>
            <InfoIconButton
              icon={<IoIosInformationCircleOutline className="text-base" />}
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
