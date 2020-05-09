import React, { useState, useEffect } from "react"

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
import { capitalizeFirst } from "~utils/common"
import { useLocation } from "react-router-dom"

type Home = PaginatedResults<HomeResults>

const useHome = () => {
  const [home, setHome] = useState<Home>(null)
  const [continueWatching, setContinueWatching] = useState<ViewHit[]>(null)
  const [error, setError] = useState<{}>(null)

  return {
    home,
    setHome,
    continueWatching,
    setContinueWatching,
    error,
    setError,
  }
}

export default ({ filters = {} }: { filters?: {} }) => {
  const { t } = useTranslation()
  const {
    home,
    setHome,
    continueWatching,
    setContinueWatching,
    error,
    setError,
  } = useHome()
  const { token } = useAuth()
  const { pathname } = useLocation()

  const getHomePage = async () => {
    try {
      setHome(await getHome(filters))
      if (token) {
        const history = await getHistory()
        setContinueWatching(history.results)
      }
      if (error) setError(null)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    getHomePage()
  }, [token, pathname])

  if (home == null) return <div>Loading home...</div>

  const { results } = home
  return (
    <div>
      <Featured data={results.featured} />
      {/* Continue watching */}
      {continueWatching && continueWatching.length > 0 && (
        <CWRow row={continueWatching} />
      )}
      {/* Recently added */}
      {results.recently_added && (
        <TitleRow row={results.recently_added} name={t("recentlyAdded")} />
      )}
      {/* Recommended featured */}
      {results.recommended && <Recommended title={results.recommended} />}
      {/* Genre rows */}
      {results.rows.map(row => (
        <TitleRow
          key={row.id}
          row={row.title_list}
          name={capitalizeFirst(row.name)}
        />
      ))}
    </div>
  )
}
