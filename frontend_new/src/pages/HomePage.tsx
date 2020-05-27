import React, { useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Featured from "../components/Featured"
import TitleRow from "../components/TitleRow"
import CWRow from "../components/containers/CWRow"
import Recommended from "../components/Recommended"
import LoadingIndicator from "../components/LoadingIndicator"
import { HomeResults, GenreRow } from "../core/interfaces/home"
import { PaginatedResults } from "../core/interfaces/paginated-results"
import { ViewHit } from "../core/interfaces/view-hit"
import client from "../api/client"
import { getHome } from "../api/home"
import { getHistory } from "../api/title"
import { useAuth } from "../context/auth-context"
import { useBackground } from "../context/background-context"
import { useDisposableEffect } from "../hooks"
import { capitalizeFirst } from "../utils/common"

const HomePage = ({ filters = {} }: { filters?: {} }) => {
  const { t } = useTranslation()
  const { home, continueWatching, loading } = useHome(filters)

  return (
    <div>
      <LoadingIndicator show={loading} />
      {home && (
        <>
          <Featured data={home.results.featured} />
          {continueWatching && continueWatching.length > 0 && (
            <CWRow row={continueWatching} />
          )}
          {home.results.recently_added && (
            <TitleRow
              id=""
              row={home.results.recently_added}
              name={t("recentlyAdded")}
            />
          )}
          {home.results.recommended && (
            <Recommended title={home.results.recommended} />
          )}
          {home.results.rows.map((row: GenreRow) => (
            <TitleRow
              key={row.id}
              id={row.id}
              row={row.title_list}
              name={capitalizeFirst(row.name)}
            />
          ))}
        </>
      )}
    </div>
  )
}

type Home = PaginatedResults<HomeResults>

const threshold = 200

const useHome = (filters: {}) => {
  const urlRef = useRef<string>(null)
  const [home, setHome] = useState<Home | null>(null)
  const [loadMore, setLoadMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [continueWatching, setContinueWatching] = useState<ViewHit[] | null>(
    null
  )
  const [error, setError] = useState(null)
  const { changeBackground } = useBackground()
  const { token } = useAuth()
  const { pathname } = useLocation()

  const getHomeRows = async (disposed: boolean) => {
    try {
      if (home?.next && urlRef.current !== home.next) {
        ;(urlRef as any).current = home.next

        const result: Home = await client.get(home.next)
        result.results.rows = [...home.results.rows, ...result.results.rows]
        !disposed && setHome(result)
      }
    } catch (error) {
      !disposed && setError(error)
    } finally {
      !disposed && setLoadMore(false)
    }
  }

  const getHomePage = async (disposed: boolean) => {
    setLoading(true)
    try {
      const result = await getHome(filters)

      if (!disposed) {
        changeBackground(result.results.featured[0])
        setHome(result)
      }

      if (token) {
        const history = await getHistory()
        !disposed && setContinueWatching(history.results)
      }

      if (error && !disposed) setError(null)
    } catch (error) {
      !disposed && setError(error)
    } finally {
      setLoading(false)
    }
  }

  useDisposableEffect(disposed => {
    const listener = () => {
      const didHitBottom =
        window.scrollY + window.innerHeight + threshold >=
        document.body.scrollHeight

      if (didHitBottom && !loadMore) {
        setLoadMore(true)
      }
    }

    window.addEventListener("scroll", listener)

    return () => {
      window.removeEventListener("scroll", listener)
    }
  }, [])

  useDisposableEffect(
    disposed => {
      getHomeRows(disposed)
    },
    [loadMore]
  )

  useDisposableEffect(
    disposed => {
      setHome(null)
      getHomePage(disposed)
    },
    [pathname, token]
  )

  return {
    home,
    loadMore,
    loading,
    continueWatching,
    error,
  }
}

export default HomePage
