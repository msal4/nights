import React, { useState } from "react"
import {
  useParams,
  Switch,
  Link,
  Route,
  useRouteMatch,
  useHistory,
} from "react-router-dom"
import { IoIosPlay, IoIosArrowBack } from "react-icons/io"
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
import SeasonDropdown from "~components/containers/SeasonDropdown"
import { useDisposableEffect } from "~hooks"
import LoadingIndicator from "~components/LoadingIndicator"
import Title from "~components/Title"
import { useBackground } from "~context/background-context"
import MyListButton from "~components/MyListButton"
import Trailer from "~components/Trailer"

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
  const { changeBackground } = useBackground()

  const getTitleDetail = async (disposed: boolean) => {
    !disposed && setLoading(true)
    try {
      const title = await getTitle(id)
      if (title.type === "s") setSelectedSeason(title.seasons[0])
      if (error && !disposed) setError(null)
      !disposed && changeBackground(title)
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
  const history = useHistory()
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { title, selectedSeason, setSelectedSeason, loading } = useTitle()

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
            <button
              className="absolute top-0 left-0 px-8 py-6 flex items-center font-thin text-sm hover:opacity-75"
              onClick={() => history.goBack()}
            >
              <IoIosArrowBack className="mr-1" />
              {t("back")}
            </button>
            <div className="p-8 flex justify-between items-center absolute bottom-0 left-0 right-0 v-gradient">
              <div className="mr-2">
                {title.is_new && (
                  <span className="px-1 bg-green-600 text-black text-xs">
                    {title.type === "s" ? "New Episodes" : "New"}
                  </span>
                )}
                <h1 className="text-lg md:text-4xl font-bold mb-1">
                  {title.name}
                </h1>
                <div className="text-xs md:text-sm opacity-75">
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
          <div className="mx-auto" style={{ maxWidth: "20rem" }}>
            {title.seasons.length > 1 && (
              <SeasonDropdown
                seasons={title.seasons}
                currentSeason={selectedSeason}
                onChange={setSelectedSeason}
              />
            )}
          </div>
          <div className="flex w-full">
            <div className="mr-10" style={{ flex: 2 }}>
              <div className="title-page-nav relative my-10 flex">
                {title.type === "s" && (
                  <UnderlineLink to={url}>{t("episodes")}</UnderlineLink>
                )}
                <UnderlineLink to={title.type == "m" ? url : `${url}/info`}>
                  {t("info")}
                </UnderlineLink>
                <UnderlineLink to={`${url}/recommended`}>
                  {t("moreLikeThis")}
                </UnderlineLink>
              </div>
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
            <Trailer className="mt-12 hidden md:block flex-1" title={title} />
          </div>
        </div>
      )}
    </>
  )
}
