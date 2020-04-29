import React, { FunctionComponent, useState } from "react"

const BackgroundContext = React.createContext(null)

export interface Background {
  background: string
  setBackground: (url: string) => void
}

const BackgroundProvider: FunctionComponent<{}> = (props) => {
  const [background, setBackground] = useState()

  return (
    <BackgroundContext.Provider
      value={{ background, setBackground }}
      {...props}
    />
  )
}

const useBackground = () => React.useContext<Background>(BackgroundContext)

export { BackgroundProvider, useBackground }
