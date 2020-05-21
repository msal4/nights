import React, { FunctionComponent, useState } from "react"
import queryString from "query-string"
import { useLocation, useHistory } from "react-router-dom"

import { useDisposableEffect } from "~hooks"
import { getTitles } from "~api/title"
import { PaginatedResults } from "~core/interfaces/paginated-results"
import { Title as ITitle } from "~core/interfaces/title"
import Title from "~components/Title"
import DropdownMenu from "~components/DropdownMenu"
import { getGenres } from "~api/genre"
import { Topic } from "~core/interfaces/topic"
import { useTranslation } from "react-i18next"
import { useQuery } from "~hooks/query"
import { title } from "~constants/api"

const SearchPage: FunctionComponent = () => {
  const query = useQuery()
  const { titles, error } = useTitles(query)
  const {
    genres,
    currentGenre,
    orderings,
    currentOrdering,
    types,
    currentType,
  } = useFilters(query)
  const { t } = useTranslation()
  const history = useHistory()

  const pushWithParams = (params: {}) => {
    const queryStr = queryString.stringify({
      ...query,
      ...params,
    })
    history.push(`/search?${queryStr}`)
  }

  if (error) return <div>{error.detail}</div>

  return (
    <>
      <h1 className="mb-10 text-6xl font-bold">Search</h1>
      <div className="flex items-start">
        <div className="bg-gray-900 px-10 py-5 mr-10 rounded">
          <h1
            className="mb-10 text-4xl font-bold"
            style={{ minWidth: "17rem" }}
          >
            {t("filters")}
          </h1>
          {genres && (
            <DropdownMenu
              topics={genres}
              currentTopic={currentGenre}
              onChange={genre => pushWithParams({ genres: genre.id })}
            />
          )}
          {types && (
            <DropdownMenu
              topics={types}
              currentTopic={currentType}
              onChange={type => pushWithParams({ type: type.id })}
            />
          )}
          {orderings && (
            <DropdownMenu
              topics={orderings}
              currentTopic={currentOrdering}
              onChange={ordering => pushWithParams({ ordering: ordering.id })}
            />
          )}
        </div>
        {titles ? (
          titles.results.length === 0 ? (
            <div>No results found for "{query?.search}"</div>
          ) : (
            <div className="flex items-center flex-wrap">
              {titles.results.map(title => (
                <Title key={title.id} title={title} />
              ))}
            </div>
          )
        ) : null}
      </div>
    </>
  )
}

const useTitles = (query: queryString.ParsedQuery<string>) => {
  const { search } = useLocation()

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
      const titles = await getTitles(query)

      if (!disposed) {
        error && setError(null)
        setTitles(titles)
      }
    } catch (error) {
      !disposed && setError(error)
    }
  }

  return { titles, error }
}

const useFilters = (query: queryString.ParsedQuery<string>) => {
  const { t } = useTranslation()
  const [genres, setGenres] = useState<Topic[]>([
    { id: null, name: t("genres") },
  ])

  const types = [
    { id: null, name: t("all") },
    { id: "m", name: t("movies") },
    { id: "s", name: t("series") },
  ]
  const orderings = [
    { id: "name", name: t("nameAsc") },
    { id: "-name", name: t("nameDesc") },
    { id: "created_at", name: t("releaseDateAsc") },
    { id: "-created_at", name: t("releaseDateDesc") },
  ]
  const { genres: genreId, type, ordering } = query

  useDisposableEffect(disposed => {
    getFilters()
  }, [])

  const getFilters = async () => {
    try {
      const result = await getGenres()
      setGenres([...genres, ...result])
    } catch (error) {
      console.log(error)
    }
  }

  return {
    genres,
    currentGenre:
      genres?.find(genre => genre.id?.toString() === genreId) || genres[0],
    types,
    currentType: types?.find(item => item.id === type) || types[0],
    orderings,
    currentOrdering:
      orderings?.find(item => item.id === ordering) || orderings[3],
  }
}

export default SearchPage
