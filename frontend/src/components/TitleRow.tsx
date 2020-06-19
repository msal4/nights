import React, { FunctionComponent } from "react";

import Title from "../components/Title";
import { Title as ITitle } from "../core/interfaces/title";
import CarouselRow from "./CarouselRow";
import { useLocation } from "react-router";

export interface TitleRowProps {
  row: ITitle[];
  name: string;
  id: string | number;
}

const TitleRow: FunctionComponent<TitleRowProps> = ({ row, name, id }) => {
  const { pathname } = useLocation();

  return (
    <CarouselRow title={name} path={id ? `/search?genres=${id}` : pathname}>
      {row.map((title) => (
        <Title key={title.id} title={title} />
      ))}
    </CarouselRow>
  );
};

export default TitleRow;
