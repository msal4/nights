import React, { useState, useEffect } from "react"
import { useParams, Switch, Route, useRouteMatch } from "react-router-dom"

import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { getTitle } from "~api/title"
import NImage from "~components/NImage"
import { getImageUrl, joinTopics } from "~utils/common"
import { IoIosStar, IoIosPlay, IoIosAdd } from "react-icons/io"
import { PrimaryButton, InfoIconButton } from "~components/Buttons"
import { useTranslation } from "react-i18next"
import TitleRecommended from "~components/TitleRecommended"
import TitleInfo from "~components/TitleInfo"

const useTitle = () => {
  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState<{}>(null)
  return { title, setTitle, error, setError }
}

export default () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { title, setTitle, error, setError } = useTitle()
  const { path } = useRouteMatch()

  const getTitleDetail = async () => {
    try {
      setTitle(await getTitle(id))
      if (error) setError(null)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getTitleDetail()
  }, [id])

  return error ? (
    <div>{error}</div>
  ) : title ? (
    <div>
      <NImage
        className="rounded-lg mb-4"
        src={getImageUrl(title.images[0]?.url, ImageQuality.h900)}
        style={{ width: "100%", paddingBottom: "40%" }}
      >
        <div className="absolute bottom-0 left-0 right-0 v-gradient flex justify-between items-center p-3">
          <div className="mr-2">
            {title.is_new && (
              <span className="bg-green-600 text-black text-xs px-1">
                {title.type === "s" ? "New Episodes" : "New"}
              </span>
            )}
            <h1 className="text-lg md:text-3xl font-bold">{title.name}</h1>
            <div className="text-xs md:text-sm text-gray-500">
              <p>{joinTopics(title.genres)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <PrimaryButton className="mr-4" to="/series/play">
              <IoIosPlay size="1.5em" />
              {t("play")}
            </PrimaryButton>
            <InfoIconButton icon={<IoIosAdd className="text-base" />}>
              <span className="hidden md:block">{t("myList")}</span>
            </InfoIconButton>
          </div>
        </div>
      </NImage>
      <Switch>
        <Route path={`${path}/recommended`}>
          <TitleRecommended />
        </Route>
        <Route path={`${path}`}>
          <TitleInfo />
        </Route>
      </Switch>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
