import React, { FunctionComponent } from "react"

import Title from "../components/Title"
import { Title as ITitle } from "../core/interfaces/title"
import CarouselRow from "./CarouselRow"

export interface TitleRowProps {
  row: ITitle[]
  name: string
  id: string | number
}

const TitleRow: FunctionComponent<TitleRowProps> = ({ row, name, id }) => (
  <CarouselRow title={name} path={id ? `/search?genres=${id}` : ""}>
    {row.map(title => (
      <Title key={title.id} title={title} />
    ))}
  </CarouselRow>
)

export default TitleRow
