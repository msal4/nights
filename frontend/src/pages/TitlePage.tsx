import React, { useState } from "react";
import {
  useParams,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";

import {
  TitleDetail,
  ImageQuality,
  Title as ITitle,
} from "../core/interfaces/title";
import { SimpleSeason } from "../core/interfaces/season";
import { getImageUrl, joinTopics } from "../utils/common";
import { getTitle } from "../api/title";
import NImage from "../components/NImage";
import TitleInfo from "../components/TitleInfo";
import UnderlineLink from "../components/UnderlineLink";
import Season from "../components/containers/Season";
import SeasonDropdown from "../components/containers/SeasonDropdown";
import { useDisposableEffect } from "../hooks";
import LoadingIndicator from "../components/LoadingIndicator";
import Title from "../components/Title";
import { useBackground } from "../context/background-context";
import MyListButton from "../components/MyListButton";
import Trailer from "../components/Trailer";
import PlayButton from "../components/PlayButton";
import ScrollToTop from "../components/ScrollToTop";

const Recommended = ({ titles }: { titles: ITitle[] }) => {
  return (
    <div className="flex flex-wrap">
      {titles.map((title) => (
        <Title key={title.id} title={title} />
      ))}
    </div>
  );
};

const useTitle = () => {
  const { id } = useParams();

  const [title, setTitle] = useState<TitleDetail | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<SimpleSeason | null>(
    null
  );
  const { changeBackground } = useBackground();

  const getTitleDetail = async (disposed: boolean) => {
    !disposed && setLoading(true);
    try {
      const title = await getTitle(id);
      if (title.type === "s") setSelectedSeason(title.seasons[0]);
      if (error && !disposed) setError(null);
      !disposed && changeBackground(title);
      !disposed && setTitle(title);
    } catch (error) {
      !disposed && setError(error);
    } finally {
      !disposed && setLoading(false);
    }
  };

  useDisposableEffect(
    (disposed) => {
      getTitleDetail(disposed);
    },
    [id]
  );

  return { title, error, loading, selectedSeason, setSelectedSeason };
};

export default () => {
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();
  const { title, selectedSeason, setSelectedSeason, loading } = useTitle();

  console.log(title && getImageUrl(title.images[0]?.url));

  return (
    <div>
      <ScrollToTop />
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
              onClick={() => history.push("/home")}
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
                <PlayButton title={title} />
                <MyListButton id={title.id} />
              </div>
            </div>
          </NImage>
          <Trailer
            className="my-12 block md:hidden flex-1 text-center"
            title={title}
          />
          <div className="mx-auto" style={{ maxWidth: "20rem" }}>
            {selectedSeason && title.seasons.length > 1 && (
              <SeasonDropdown
                seasons={title.seasons}
                currentSeason={selectedSeason}
                onChange={setSelectedSeason}
              />
            )}
          </div>
          <div className="flex w-full">
            <div className="md:mr-10" style={{ flex: 2 }}>
              <div className="title-page-nav relative my-10 flex">
                {title.type === "s" && (
                  <UnderlineLink to={url}>{t("episodes")}</UnderlineLink>
                )}
                <UnderlineLink to={title.type === "m" ? url : `${url}/info`}>
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
    </div>
  );
};
