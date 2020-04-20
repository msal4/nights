import { Title as ITitle } from "~core/interfaces/title"
import React, { FunctionComponent } from "react"
import {
  IoIosStar,
  IoIosPlay,
  IoIosAdd,
  IoIosInformationCircleOutline,
} from "react-icons/io"
import { useTranslation } from "react-i18next"

import { PrimaryButton, InfoIconButton } from "./Buttons"
import { joinTopics } from "~utils/common"

export interface FeaturedProps {
  data: ITitle[]
}

const Featured: FunctionComponent<FeaturedProps> = ({ data }) => {
  const { t } = useTranslation()

  const FeaturedItem = ({
    className = "",
    title,
  }: {
    className?: string
    title: ITitle
  }) => (
    <div
      className={`h-40 w-64 bg-cover bg-center rounded-lg relative text-sm font-light ${className}`}
      style={{
        background: "url(/static/frontend/images/mulan.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <h4 className="absolute bottom-0 right-0 left-0 px-3 py-2 v-gradient">
        {title.name}
      </h4>
    </div>
  )

  const BottomInfo = () => (
    <div className="absolute bottom-0 left-0 right-0 v-gradient flex justify-between items-center p-3">
      <div className="mr-2">
        <h1 className="text-xl md:text-3xl font-bold leading-none">
          {data[0]?.name}
        </h1>
        <div className="text-xs md:text-sm text-gray-500">
          <p>{joinTopics(data[0]?.genres)}</p>
          <div className="flex items-center">
            <p className="mr-2">{data[0].rated}</p>
            <p className="flex items-center mr-2">
              <IoIosStar className="text-blue-600" fontSize=".55em" />
              {data[0].rating}
            </p>
            <p>{new Date(data[0].released_at).getFullYear()}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <PrimaryButton className="md:mr-4" to="/series/play">
          <IoIosPlay size="1.5em" />
          {t("play")}
        </PrimaryButton>
        <InfoIconButton
          className="hidden md:flex mr-4"
          icon={<IoIosAdd className="text-base" />}
        >
          {t("myList")}
        </InfoIconButton>
        <InfoIconButton
          className="hidden md:flex"
          icon={<IoIosInformationCircleOutline className="text-base" />}
        >
          {t("info")}
        </InfoIconButton>
      </div>
    </div>
  )

  return (
    <div className="flex mt-4 mb-5">
      <div
        className="relative h-64 md:h-auto flex-1 bg-cover bg-center rounded-lg md:mr-4"
        style={{
          background: "url(/static/frontend/images/mulan.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <BottomInfo />
      </div>
      <div className="hidden md:block">
        <FeaturedItem className="mb-4" title={data[1]} />
        <FeaturedItem className="mb-4" title={data[2]} />
        <FeaturedItem title={data[3]} />
      </div>
    </div>
  )
}

export default Featured
