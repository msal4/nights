import React, { useState, useEffect } from "react"
import { useParams, Switch, Route, useRouteMatch } from "react-router-dom"
import { IoIosPlay, IoIosAdd } from "react-icons/io"
import { useTranslation } from "react-i18next"

import { TitleDetail, ImageQuality } from "~core/interfaces/title"
import { SimpleSeason } from "~core/interfaces/season"
import { getImageUrl, joinTopics } from "~utils/common"
import { getTitle } from "~api/title"
import { PrimaryButton, InfoIconButton } from "../components/common/Buttons"
import NImage from "~components/NImage"
import TitleInfo from "~components/TitleInfo"
import UnderlineLink from "~components/UnderlineLink"
import Season from "~components/containers/Season"
import SeasonDropdown from "~components/SeasonDropdown"
import TitleRow from "~components/TitleRow"

const useTitle = () => {
  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState<{}>(null)
  const [selectedSeason, setSelectedSeason] = useState<SimpleSeason>(null)
  return { title, setTitle, error, setError, selectedSeason, setSelectedSeason }
}

export default () => {
  const { id } = useParams()
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const {
    title,
    setTitle,
    error,
    setError,
    selectedSeason,
    setSelectedSeason,
  } = useTitle()

  const getTitleDetail = async () => {
    try {
      const title = await getTitle(id)
      if (title.type === "s") setSelectedSeason(title.seasons[0])
      if (error) setError(null)
      setTitle(title)
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
    <div className="pb-40">
      <NImage
        className="relative rounded-lg mb-16"
        src={getImageUrl(title.images[0]?.url, ImageQuality.h900)}
        style={{ width: "100%", paddingBottom: "40%" }}
      >
        <div className="flex justify-between items-center p-3 absolute bottom-0 left-0 right-0 v-gradient ">
          <div className="mr-2">
            {title.is_new && (
              <span className="px-1 bg-green-600 text-black text-xs">
                {title.type === "s" ? "New Episodes" : "New"}
              </span>
            )}
            <h1 className="text-lg md:text-3xl font-bold">{title.name}</h1>
            <div className="text-xs md:text-sm text-gray-500">
              <p>{joinTopics(title.genres)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <PrimaryButton
              className="mr-4"
              to={`${url.replace("title", "movie")}/play`}
            >
              <IoIosPlay size="1.5em" />
              {t("play")}
            </PrimaryButton>
            <InfoIconButton icon={<IoIosAdd className="text-base" />}>
              <span className="hidden md:block">{t("myList")}</span>
            </InfoIconButton>
          </div>
        </div>
      </NImage>

      {title.seasons.length > 1 && (
        <SeasonDropdown
          seasons={title.seasons}
          currentSeason={selectedSeason}
          onChange={setSelectedSeason}
        />
      )}

      <div className="mt-10 mb-10 flex">
        {title.type === "s" && (
          <UnderlineLink className="mr-2" to={url}>
            {t("episodes")}
          </UnderlineLink>
        )}
        <UnderlineLink className="mr-4" to={`${url}/info`}>
          {t("info")}
        </UnderlineLink>
        <UnderlineLink to={`${url}/recommended`}>
          {t("moreLikeThis")}
        </UnderlineLink>
      </div>
      <Switch>
        <Route path={`${path}/recommended`}>
          <TitleRow row={title.recommended} name={""} />
        </Route>
        <Route path={`${path}/info`}>
          <TitleInfo title={title} />
        </Route>
        {selectedSeason && (
          <Route path={path}>
            <Season seriesId={title.id} seasonId={selectedSeason.id} />
          </Route>
        )}
      </Switch>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
