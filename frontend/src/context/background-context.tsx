import React, { FunctionComponent, useState } from "react"
import { getImageUrl } from "~utils/common"
import { ImageQuality, TitleDetail } from "~core/interfaces/title"

const BackgroundContext = React.createContext(null)

export interface Background {
  background: string
  changeBackground: (title: TitleDetail) => void
}

const BackgroundProvider: FunctionComponent<any> = props => {
  const [background, setBackground] = useState<String>()

  const changeBackground = (title: TitleDetail) => {
    const bg = getImageUrl(title?.images[0]?.url, ImageQuality.h900)
    bg && bg !== background && setBackground(bg)
  }

  return (
    <BackgroundContext.Provider
      value={{ background, changeBackground }}
      {...props}
    />
  )
}

const useBackground = () => React.useContext<Background>(BackgroundContext)

export { BackgroundProvider, useBackground }
