import { IoIosSearch } from "react-icons/io"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import queryString from "query-string"
import { useHistory } from "react-router-dom"
import useConstant from "use-constant"
import AwesomeDebouncePromise from "awesome-debounce-promise"
import { useAsync } from "react-async-hook"
import { useQuery } from "~hooks/query"

const useSearchFocusState = (value: boolean) => {
  const [searchFocused, setSearchFocused] = useState(value)
  const focusSearch = () => setSearchFocused(true)
  const blurSearch = () => setSearchFocused(false)
  return { searchFocused, focusSearch, blurSearch }
}

export default (props: { className?: string }) => {
  const { searchFocused, focusSearch, blurSearch } = useSearchFocusState(false)
  const { t } = useTranslation()
  const queryParams = useQuery()
  const { searchText, setSearchText } = useDebouncedSearch(queryParams)

  return (
    <div
      className={
        "flex items-center rounded-full py-1 px-2 mt-2 md:mt-0 " +
        (props.className || "")
      }
      style={{
        boxShadow: !searchFocused ? "0 0 0 1px gray" : "0 0 0 1px white",
      }}
    >
      <IoIosSearch
        style={{ minWidth: "1rem" }}
        size="1.5em"
        color={searchFocused ? "white" : "gray"}
      />
      <input
        className="bg-transparent text-sm w-full mx-2 font-thin outline-none"
        type="text"
        placeholder={t("search")}
        value={searchText}
        onFocus={focusSearch}
        onBlur={blurSearch}
        onChange={e => setSearchText(e.target.value)}
      />
    </div>
  )
}

const useDebouncedSearch = (queryParams: any) => {
  const [searchText, setSearchText] = useState(queryParams?.search || "")
  const history = useHistory()

  const searchTitles = (search: string) => {
    if (search) {
      const query = queryString.stringify({ ...queryParams, search })
      history.push(`/search?${query}`)
    }
  }

  const debouncedSearchTitles = useConstant(() =>
    AwesomeDebouncePromise(searchTitles, 300)
  )

  useAsync(async () => debouncedSearchTitles(searchText), [
    debouncedSearchTitles,
    searchText,
  ])

  return { searchText, setSearchText }
}
