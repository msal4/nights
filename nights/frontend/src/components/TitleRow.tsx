import React from "react"

import Title from "~components/Title"
import "../styles/TitleRow.css"

export default () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const comps = list.map((i) => <Title key={i} />)
  return (
    <div className="w-full pl-2">
      <div className="title flex justify-between">
        <h5 className="font-semibold">Drama</h5>
        <h5 className="ml-4 mr-16 text-xs font-thin">See more</h5>
      </div>
      <div className="flex overflow-x-hidden py-4">{comps}</div>
    </div>
  )
}
