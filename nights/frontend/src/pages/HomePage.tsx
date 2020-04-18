import React from "react"

import TitleRow from "~components/TitleRow"
import homeMockJson from "~api/mock/home.json"

export default () => {
  console.log(homeMockJson)
  return (
    <div>
      <TitleRow />
      <TitleRow />
      <TitleRow />
      <TitleRow />
      <TitleRow />
    </div>
  )
}
