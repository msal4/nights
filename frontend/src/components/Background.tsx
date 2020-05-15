import { useBackground } from "~context/background-context"
import React from "react"

export default () => {
  const { background } = useBackground()
  return (
    <div
      className="absolute inset-0 transition-all duration-1000"
      style={{
        background: `linear-gradient(150deg, rgba(0,0,0,0) 0%, rgba(0,0,8,1) 38%, rgba(0,0,8,1) 49%, rgba(0,0,8,1) 100%), url(${background})`,
        filter: "blur(15px)",
        opacity: 0.5,
        zIndex: -1,
      }}
    />
  )
}
