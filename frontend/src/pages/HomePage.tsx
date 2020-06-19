import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Featured from "../components/Featured";
import TitleRow from "../components/TitleRow";
import CWRow from "../components/containers/CWRow";
import Recommended from "../components/Recommended";
import LoadingIndicator from "../components/LoadingIndicator";
import { GenreRow } from "../core/interfaces/home";
import { PaginatedResults } from "../core/interfaces/paginated-results";
import { ViewHit } from "../core/interfaces/view-hit";
import client from "../api/client";
import { getHistory } from "../api/title";
import { useAuth } from "../context/auth-context";
import { useDisposableEffect } from "../hooks";
import { capitalizeFirst } from "../utils/common";
import { Title, TitleDetail } from "../core/interfaces/title";
import {
  getGenreRows,
  getPromos,
  getRecentlyAdded,
  getTrending,
} from "../api/home";
import ScrollToTop from "../components/ScrollToTop";

const HomePage = ({ filters = {} }: { filters?: {} }) => {
  const { t } = useTranslation();
  const { home, loading } = useHome(filters);

  return (
    <div>
      <ScrollToTop />
      <LoadingIndicator show={loading} />
      {home.promos && <Featured data={home.promos} />}
      {home.continueWatching && home.continueWatching.length > 0 && (
        <CWRow row={home.continueWatching} />
      )}
      {home.trending && (
        <TitleRow path="" row={home.trending.results} name={t("trending")} />
      )}
      {home.recentlyAdded && (
        <TitleRow
          path="/search"
          row={home.recentlyAdded.results}
          name={t("recentlyAdded")}
        />
      )}
      {home.promos && home.promos[4] && <Recommended title={home.promos[4]} />}
      {home.rows &&
        home.rows.results
          .filter((row) => row?.title_list?.length > 0)
          .map((row: GenreRow) => (
            <TitleRow
              key={row.id}
              path={`/search?genres=${row.id}`}
              row={row.title_list}
              name={capitalizeFirst(row.name)}
            />
          ))}
    </div>
  );
};

interface Home {
  recentlyAdded?: PaginatedResults<Title[]> | null;
  trending?: PaginatedResults<Title[]> | null;
  continueWatching?: ViewHit[] | null;
  promos?: TitleDetail[] | null;
  rows?: PaginatedResults<GenreRow[]> | null;
}

const threshold = 200;

const useHome = (filters: {}) => {
  const urlRef = useRef<string>(null);
  const [home, setHome] = useState<Home>({
    recentlyAdded: null,
    trending: null,
    continueWatching: null,
    promos: null,
    rows: null,
  });
  const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { pathname } = useLocation();

  const getHomeRows = async (disposed: boolean) => {
    try {
      if (home.rows?.next && urlRef.current !== home.rows?.next) {
        (urlRef as any).current = home.rows?.next;

        const rows: PaginatedResults<GenreRow[]> = await client.get(
          home.rows.next
        );
        rows.results = [...home.rows.results, ...rows.results];
        !disposed && setHome((state) => ({ ...state, rows }));
      }
    } catch (error) {
      !disposed && setError(error);
    } finally {
      !disposed && setLoadMore(false);
    }
  };

  const getHomePage = async (disposed: boolean) => {
    setLoading(true);
    try {
      const promos = await getPromos({ ...filters, limit: 5 });
      if (!disposed) {
        setHome({ ...home, promos: null });
        setHome((state) => ({ ...state, promos }));
      }

      const rows = await getGenreRows(filters);
      !disposed && setHome((state) => ({ ...state, rows }));

      const recentlyAdded = await getRecentlyAdded(filters);
      !disposed && setHome((state) => ({ ...state, recentlyAdded }));

      const trending = await getTrending(filters);
      !disposed && setHome((state) => ({ ...state, trending }));

      if (token) {
        const { results } = await getHistory();
        !disposed &&
          setHome((state) => ({ ...state, continueWatching: results }));
      }

      if (error && !disposed) setError(null);
    } catch (error) {
      !disposed && setError(error);
    } finally {
      setLoading(false);
    }
  };

  useDisposableEffect((_) => {
    const listener = () => {
      const didHitBottom =
        window.scrollY + window.innerHeight + threshold >=
        document.body.scrollHeight;

      if (didHitBottom && !loadMore) {
        setLoadMore(true);
      }
    };

    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  useDisposableEffect(
    (disposed) => {
      getHomeRows(disposed);
    },
    [loadMore]
  );

  useDisposableEffect(
    (disposed) => {
      getHomePage(disposed);
    },
    [pathname, token]
  );

  return {
    home,
    loadMore,
    loading,
    error,
  };
};

export default HomePage;
