import React, { FunctionComponent, useState } from "react"
import { SimpleSeason } from "~core/interfaces/season"
import { IoIosArrowDown } from "react-icons/io"
import { useTranslation } from "react-i18next"

export interface DropdownMenuProps {
  seasons: SimpleSeason[]
  currentSeason: SimpleSeason
  onChange: (season: SimpleSeason) => void
}

const SeasonDropdown: FunctionComponent<DropdownMenuProps> = ({
  seasons,
  currentSeason,
  onChange,
}) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-col items-center">
      <button
        className={`flex items-center relative z-10 underline-before ${
          menuOpened ? "highlight-before" : ""
        } text-white focus:outline-none hover:text-white`}
        onClick={() => setMenuOpened(!menuOpened)}
      >
        {t("season")} {currentSeason.index + 1}
        <IoIosArrowDown
          className={`ml-2 transition-transform duration-500 ease-in-out ${
            menuOpened ? "transform rotate-180" : ""
          }`}
          size="1em"
        />
      </button>
      {menuOpened && (
        <div
          className="mt-10 pt-2 absolute z-10 rounded bg-gray-900 overflow-auto"
          style={{ maxHeight: "10rem" }}
        >
          {seasons
            .filter(season => season.id !== currentSeason.id)
            .map(season => (
              <button
                className="block px-4 py-1 mb-2 text-white hover:bg-blue-500 hover:text-black"
                key={season.id}
                onClick={() => {
                  onChange(season)
                  setMenuOpened(false)
                }}
              >
                {t("season")} {season.index + 1}
              </button>
            ))}
        </div>
      )}
      {menuOpened && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 w-full h-full"
          onClick={() => setMenuOpened(false)}
        />
      )}
    </div>
  )
}

export default SeasonDropdown
