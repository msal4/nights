import React, { useState, useEffect } from "react"

import Featured from "~components/Featured"
import { HomeResults } from "~core/interfaces/home"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import TitleRow from "~components/TitleRow"
import CWRow from "~components/CWRow"
import { capitalizeFirst } from "~utils/common"
import { useTranslation } from "react-i18next"
import Recommended from "~components/Recommended"
import { getHome } from "~api/home"
import client from "~api/client"

type Home = PaginatedResults<HomeResults>

const useHome = () => {
  const [home, setHome] = useState<Home>(null)
  const [error, setError] = useState<{}>(null)

  return { home, setHome, error, setError }
}

export default () => {
  const { t } = useTranslation()
  const { home, setHome, error, setError } = useHome()
  console.log(home)

  const getHomePage = async () => {
    try {
      setHome(await getHome())
      console.log("vaoala")
      if (error) setError(null)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  useEffect(() => {
    getHomePage()
  }, [])

  if (home == null) return <div>Loading home...</div>

  const { results } = home
  return (
    <>
      <Featured data={results.featured} />
      {/* Continue watching */}
      {results.recently_watched && <CWRow row={results.recently_watched} />}
      {/* Recently added */}
      {results.recently_added && (
        <TitleRow row={results.recently_added} name={t("recentlyAdded")} />
      )}
      {/* Recommended featured */}
      {results.recommended && <Recommended title={results.recommended} />}
      {/* Genre rows */}
      {/* {results.rows.map((row) => (
        <TitleRow
          key={row.id}
          row={row.title_list}
          name={capitalizeFirst(row.name)}
        />
      ))} */}
    </>
  )
}
