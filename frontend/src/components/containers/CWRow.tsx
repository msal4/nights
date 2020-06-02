import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveType } from "react-multi-carousel";

import CarouselRow from "../CarouselRow";
import { ViewHit } from "../../core/interfaces/view-hit";
import CWCard from "../../components/containers/CWCard";

export interface TitleRowProps {
  row: ViewHit[];
  responsive?: ResponsiveType;
  showTitle?: boolean;
  showX?: boolean;
}

const CWRow: FunctionComponent<TitleRowProps> = ({
  row,
  responsive,
  showTitle = true,
  showX = true,
}) => {
  const { t } = useTranslation();

  return (
    <CarouselRow
      className="pb-6"
      title={showTitle ? t("continueWatching") : ""}
      path=""
      showX={showX}
      responsive={{
        desktop: {
          breakpoint: { max: 6000, min: 464 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
        ...(responsive || {}),
      }}
    >
      {row.map((hit) => (
        <CWCard key={hit.id} hit={hit} />
      ))}
    </CarouselRow>
  );
};

export default CWRow;
