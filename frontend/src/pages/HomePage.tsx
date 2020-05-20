import React, { useState, useRef } from "react"
import { useLocation } from "react-router-dom"

import Featured from "~components/Featured"
import { HomeResults } from "~core/interfaces/home"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import TitleRow from "~components/TitleRow"
import CWRow from "~components/containers/CWRow"
import { useTranslation } from "react-i18next"
import Recommended from "~components/Recommended"
import { getHome } from "~api/home"
import { useAuth } from "~context/auth-context"
import { ViewHit } from "~core/interfaces/view-hit"
import { getHistory } from "~api/title"
import { capitalizeFirst, getImageUrl } from "~utils/common"
import client from "~api/client"
import { useDisposableEffect } from "~hooks"
import LoadingIndicator from "~components/LoadingIndicator"
import { useBackground } from "~context/background-context"
import { ImageQuality } from "~core/interfaces/title"

const HomePage = ({ filters = {} }: { filters?: {} }) => {
  const { t } = useTranslation()
  const { home, continueWatching, loading } = useHome(filters)

  return (
    <>
      <LoadingIndicator show={loading} />
      {home && (
        <>
          <Featured data={home.results.featured} />
          {continueWatching && continueWatching.length > 0 && (
            <CWRow row={continueWatching} />
          )}
          {home.results.recently_added && (
            <TitleRow
              row={home.results.recently_added}
              name={t("recentlyAdded")}
            />
          )}
          {home.results.recommended && (
            <Recommended title={home.results.recommended} />
          )}
          {home.results.rows.map(row => (
            <TitleRow
              key={row.id}
              row={row.title_list}
              name={capitalizeFirst(row.name)}
            />
          ))}
        </>
      )}
    </>
  )
}

type Home = PaginatedResults<HomeResults>

const threshold = 200

const useHome = (filters: {}) => {
  const urlRef = useRef<string>(null)
  const [home, setHome] = useState<Home>(null)
  const [loadMore, setLoadMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [continueWatching, setContinueWatching] = useState<ViewHit[]>(null)
  const [error, setError] = useState<{}>(null)
  const { changeBackground } = useBackground()
  const { token } = useAuth()
  const { pathname } = useLocation()

  const getHomeRows = async (disposed: boolean) => {
    try {
      if (home.next && urlRef.current !== home.next) {
        urlRef.current = home.next
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
