import React, { FunctionComponent } from "react"
import { SimpleSeason } from "~core/interfaces/season"
import { useTranslation } from "react-i18next"
import DropdownMenu from "../DropdownMenu"
import { Topic } from "~core/interfaces/topic"

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
  const convert = ({ id, index }: SimpleSeason): Topic => ({
    id,
    name: `${season} ${index + 1}`,
  })

  const currentItem = convert(currentSeason)
  const items = seasons.map(convert)

  return (
    <DropdownMenu
      topics={items}
      currentTopic={currentItem}
      onChange={item => onChange(seasons.find(season => season.id === item.id))}
    />
  )
}

export default SeasonDropdown
