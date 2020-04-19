import React from "react"

import homeMockJson from "~api/mock/home.json"
import Featured from "~components/Featured"
import { HomeResults } from "~core/interfaces/home"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import TitleRow from "~components/TitleRow"

export default () => {
  const data = homeMockJson as PaginatedResults<HomeResults>

  return (
    <div>
      <Featured data={data.results.featured} />
      {data.results.rows.map((row) => (
        <TitleRow key={row.id} row={row} />
      ))}
    </div>
  )
}
