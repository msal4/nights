import React, { useState } from "react"
import { useParams, Switch, Route, useRouteMatch } from "react-router-dom"
import { IoIosPlay, IoIosAdd } from "react-icons/io"
import { useTranslation } from "react-i18next"

import {
  TitleDetail,
  ImageQuality,
  Title as ITitle,
} from "~core/interfaces/title"
import { SimpleSeason } from "~core/interfaces/season"
import { getImageUrl, joinTopics } from "~utils/common"
import { getTitle } from "~api/title"
import { PrimaryButton, InfoIconButton } from "../components/common/Buttons"
import NImage from "~components/NImage"
import TitleInfo from "~components/TitleInfo"
import UnderlineLink from "~components/UnderlineLink"
import Season from "~components/containers/Season"
import SeasonDropdown from "~components/SeasonDropdown"
import { useDisposableEffect } from "~hooks"
import LoadingIndicator from "~components/LoadingIndicator"
import Title from "~components/Title"
import { useBackground } from "~context/background-context"
import MyListButton from "~components/MyListButton"

const Recommended = ({ titles }: { titles: ITitle[] }) => {
  return (
    <div className="flex flex-wrap">
      {titles.map(title => (
        <Title key={title.id} title={title} />
      ))}
    </div>
  )
}

const useTitle = () => {
  const { id } = useParams()

  const [title, setTitle] = useState<TitleDetail>(null)
  const [error, setError] = useState<{}>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState<SimpleSeason>(null)
  const { background, setBackground } = useBackground()

  const getTitleDetail = async (disposed: boolean) => {
    !disposed && setLoading(true)
    try {
      const title = await getTitle(id)
      if (title.type === "s") setSelectedSeason(title.seasons[0])
      if (error && !disposed) setError(null)
      const bg = getImageUrl(title.images[0]?.url, ImageQuality.h900)
      !disposed && bg && bg !== background && setBackground(bg)
      !disposed && setTitle(title)
    } catch (error) {
      !disposed && setError(error)
    } finally {
      !disposed && setLoading(false)
    }
  }

  useDisposableEffect(
    disposed => {
      getTitleDetail(disposed)
    },
    [id]
  )

  return { title, error, loading, selectedSeason, setSelectedSeason }
}

export default () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const {
    title,
    error,
    selectedSeason,
    setSelectedSeason,
    loading,
  } = useTitle()

  return (
    <>
      <LoadingIndicator show={loading} />
      {title && (
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
                  className="mr-8"
                  to={
                    title.type === "m"
                      ? `/movie/${title.id}/play`
                      : `/series/${title.id}/auto/auto/play`
                  }
                >
                  <IoIosPlay size="1.5em" />
                  {t("play")}
                </PrimaryButton>
                <MyListButton id={title.id} />
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
            <UnderlineLink
              className="mr-4"
              to={title.type == "m" ? url : `${url}/info`}
            >
              {t("info")}
            </UnderlineLink>
            <UnderlineLink to={`${url}/recommended`}>
              {t("moreLikeThis")}
            </UnderlineLink>
          </div>
          <div className="max-w-2xl">
            <Switch>
              <Route path={`${path}/recommended`}>
                <Recommended titles={title.recommended} />
              </Route>
              <Route path={title.type === "m" ? path : `${path}/info`}>
                <TitleInfo title={title} />
              </Route>
              {selectedSeason && (
                <Route path={path}>
                  <Season seriesId={title.id} seasonId={selectedSeason.id} />
                </Route>
              )}
            </Switch>
          </div>
        </div>
      )}
    </>
  )
}
