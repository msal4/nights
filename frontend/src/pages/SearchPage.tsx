import React, { FunctionComponent, useState } from "react"
import queryString from "query-string"
import { useLocation } from "react-router-dom"

import { useDisposableEffect } from "~hooks"
import { getTitles } from "~api/title"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import { Title as ITitle } from "~core/interfaces/title"
import Title from "~components/Title"

const SearchPage: FunctionComponent = () => {
  const { queryParams, titles, error } = useTitles()
  if (error) return <div>{error.detail}</div>

  if (titles && titles.results.length === 0)
    return <div>No results found for "{queryParams?.search}"</div>

  return (
    titles && (
      <div className="flex items-center flex-wrap">
        {titles.results.map(title => (
          <Title key={title.id} title={title} />
        ))}
      </div>
    )
  )
}

const useTitles = () => {
  const { search } = useLocation()
  const queryParams = useQuery(search)

  const [titles, setTitles] = useState<PaginatedResults<ITitle[]>>(null)
  const [error, setError] = useState(null)

  useDisposableEffect(
    disposed => {
      getResults(disposed)
    },
    [search]
  )

  const getResults = async (disposed: boolean) => {
    try {
      const titles = await getTitles(queryParams)

      if (!disposed) {
        error && setError(null)
        setTitles(titles)
      }
    } catch (error) {
      !disposed && setError(error)
    }
  }

  return { queryParams, titles, error }
}

const useQuery = (search: string) => queryString.parse(search)

export default SearchPage
