import React, { FunctionComponent, useState } from "react";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PaginatedResults } from "../core/interfaces/paginated-results";
import { Title as ITitle } from "../core/interfaces/title";
import { Topic } from "../core/interfaces/topic";
import { getTitles } from "../api/title";
import { getGenres } from "../api/genre";
import client from "../api/client";
import { cleanObjectProperties } from "../utils/common";
import { useDisposableEffect } from "../hooks";
import { useQuery } from "../hooks/query";
import Title from "../components/Title";
import DropdownMenu from "../components/DropdownMenu";
import LoadingIndicator from "../components/LoadingIndicator";
import ScrollToTop from "../components/ScrollToTop";

const SearchPage: FunctionComponent = () => {
  const query = useQuery();
  const { titles, loadMore, loading, error } = useTitles(query);
  const {
    genres,
    currentGenre,
    orderings,
    currentOrdering,
    types,
    currentType,
  } = useFilters(query);
  const { t } = useTranslation();
  const history = useHistory();

  const pushWithParams = (params: {}) => {
    const newParams = cleanObjectProperties({
      ...query,
      ...params,
    });

    const queryStr = queryString.stringify(newParams);
    history.push(`/search?${queryStr}`);
  };

  if (error) return <div>{(error as any)?.detail}</div>;

  return (
    <div>
      <ScrollToTop />
      <LoadingIndicator show={loading} />
      <div className="flex flex-col md:flex-row md:mt-32 items-center md:items-start">
        <div className="w-full md:w-auto mb-10 md:mt-16 md:mr-10">
          <div
            className="px-10 py-5 bg-gray-900"
            style={{ borderRadius: "1.5rem" }}
          >
            <h1
              className="mb-10 text-xl font-bold"
              style={{ minWidth: "17rem" }}
            >
              {t("sort")}
            </h1>
            {orderings && (
              <DropdownMenu
                topics={orderings}
                currentTopic={currentOrdering}
                onChange={(ordering) =>
                  pushWithParams({ ordering: ordering.id })
                }
              />
            )}
          </div>
          <div
            className="px-10 py-5 mt-10 bg-gray-900"
            style={{ borderRadius: "1.5rem" }}
          >
            <h1
              className="mb-10 text-xl font-bold"
              style={{ minWidth: "17rem" }}
            >
              {t("filters")}
            </h1>
            {genres && (
              <DropdownMenu
                topics={genres}
                currentTopic={currentGenre}
                onChange={(genre) => pushWithParams({ genres: genre.id })}
              />
            )}
            {types && (
              <DropdownMenu
                topics={types}
                currentTopic={currentType}
                onChange={(type) => pushWithParams({ type: type.id })}
              />
            )}
          </div>
        </div>
        <div>
          <h1 className="ml-2 text-xl font-semibold">{t("results")}</h1>
          <div>
            {titles ? (
              titles.results.length === 0 ? (
                <div>No results found for "{query?.search}"</div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center flex-wrap">
                    {titles.results.map((title: ITitle) => (
                      <Title key={title.id} title={title} />
                    ))}
                  </div>
                  <div className="mt-10 mb-8" style={{ minHeight: "4rem" }}>
                    {!loading && titles.next && (
                      <button
                        className="py-2 px-8 rounded-full transition-all duration-200 hover:bg-white hover:text-black"
                        onClick={loadMore}
                        style={{ border: "1px solid white" }}
                      >
                        {t("loadMore")}
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const useTitles = (query: queryString.ParsedQuery<string>) => {
  const { search } = useLocation();

  const [titles, setTitles] = useState<PaginatedResults<ITitle[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useDisposableEffect(
    (disposed) => {
      getResults(disposed);
    },
    [search]
  );

  const getResults = async (disposed: boolean) => {
    setLoading(true);
    try {
      const titles = await getTitles(query);

      if (!disposed) {
        error && setError(null);
        setTitles(titles);
      }
    } catch (error) {
      !disposed && setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (titles?.next) {
      setLoading(true);
      try {
        const res: PaginatedResults<ITitle[]> = await client.get(titles.next);
        res.results = [...titles.results, ...res.results];
        setTitles(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return { titles, loadMore, loading, error };
};

const useFilters = (query: queryString.ParsedQuery<string>) => {
  const { t } = useTranslation();
  const [genres, setGenres] = useState<Topic[]>([
    { id: "", name: `${t("genres")} - ${t("all")}` },
  ]);

  const types: Topic[] = [
    { id: "", name: `${t("type")} - ${t("all")}` },
    { id: "m", name: t("movies") },
    { id: "s", name: t("series") },
  ];
  const orderings: Topic[] = [
    { id: "name", name: t("nameAsc") },
    { id: "-name", name: t("nameDesc") },
    { id: "-views", name: `${t("popularity")} ${t("asc")}` },
    { id: "views", name: `${t("popularity")} ${t("desc")}` },
    { id: "rating", name: `${t("rating")} ${t("asc")}` },
    { id: "-rating", name: `${t("rating")} ${t("desc")}` },
    { id: "created_at", name: t("releaseDateAsc") },
    { id: "-created_at", name: t("releaseDateDesc") },
  ];
  const { genres: genreId, type, ordering } = query;

  useDisposableEffect((disposed) => {
    getFilters(disposed);
  }, []);

  const getFilters = async (disposed: boolean) => {
    try {
      const result = await getGenres();
      !disposed && setGenres([...genres, ...result]);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    genres,
    currentGenre:
      genres?.find((genre) => genre.id?.toString() === genreId) || genres[0],
    types,
    currentType: types?.find((item) => item.id === type) || types[0],
    orderings,
    currentOrdering:
      orderings?.find((item) => item.id === ordering) || orderings[7],
  };
};

export default SearchPage;
