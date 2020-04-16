import React, { useEffect } from "react"

import './App.css'

import Title from "./Title"

export const AppContext = React.createContext({
  authenticated: true,
  lang: "en",
  theme: "dark",
})

export const App = () => {
  return (
    <div className="text-white flex items-center justify-center h-screen w-screen">
      <Title />
    </div>
  )
}
