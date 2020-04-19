import React from "react"

import homeMockJson from "~api/mock/home.json"
import Featured from "~components/Featured"
import { HomeResults } from "~core/interfaces/home"
import { PaginatedResults } from "~core/interfaces/paginated-results"

export default () => {
  const data = homeMockJson as PaginatedResults<HomeResults>

  return (
    <div>
      <Featured data={data.results.featured} />
    </div>
  )
}
