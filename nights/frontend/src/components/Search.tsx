import { IoIosSearch } from "react-icons/io"
import React, { useState } from "react"

const useSearchFocusState = (value: boolean) => {
  const [searchFocused, setSearchFocused] = useState(value)
  const focusSearch = () => setSearchFocused(true)
  const blurSearch = () => setSearchFocused(false)
  return { searchFocused, focusSearch, blurSearch }
}

export default (props: { className?: string }) => {
  const { searchFocused, focusSearch, blurSearch } = useSearchFocusState(false)

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
        placeholder="Search"
        onFocus={focusSearch}
        onBlur={blurSearch}
      />
    </div>
  )
}
