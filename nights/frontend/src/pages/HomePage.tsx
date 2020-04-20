import React from "react"

import homeMockJson from "~api/mock/home.json"
import Featured from "~components/Featured"
import { HomeResults } from "~core/interfaces/home"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import TitleRow from "~components/TitleRow"
import CWRow from "~components/CWRow"
import Title from "~components/Title"
import { capitalizeFirst } from "~utils/common"
import { useTranslation } from "react-i18next"
import Recommended from "~components/Recommended"

export default () => {
  const { t } = useTranslation()

  const { results } = homeMockJson as PaginatedResults<HomeResults>
  return (
    <>
      <Featured data={results.featured} />
      {/* Continue watching */}
      {results.recently_watched && <CWRow row={results.recently_watched} />}
      {results.recently_added && (
        <TitleRow row={results.recently_added} name={t("recentlyAdded")} />
      )}
      {results.recommended && <Recommended title={results.recommended} />}
      {/* Genre rows */}
      {results.rows.map((row) => (
        <TitleRow
          key={row.id}
          row={row.title_list}
          name={capitalizeFirst(row.name)}
        />
      ))}
    </>
  )
}
