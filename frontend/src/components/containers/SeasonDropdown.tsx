import React, { FunctionComponent } from "react"
import { SimpleSeason } from "~core/interfaces/season"
import { useTranslation } from "react-i18next"
import DropdownMenu, { Item } from "../DropdownMenu"

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
  const { t } = useTranslation()
  const season = t("season")

  // Convert a Season to an Item
  const convert = ({ id, index }: SimpleSeason): Item => ({
    id,
    name: `${season} ${index + 1}`,
  })

  const currentItem = convert(currentSeason)
  const items = seasons.map(convert)

  return (
    <DropdownMenu
      items={items}
      currentItem={currentItem}
      onChange={item => onChange(seasons.find(season => season.id === item.id))}
    />
  )
}

export default SeasonDropdown
