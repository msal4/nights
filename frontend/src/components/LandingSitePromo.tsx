import { FunctionComponent } from "react";
import React from "react";

import "../styles/LandingSitePromo.scss";
import { useTranslation } from "react-i18next";
import NImage from "./NImage";

export interface LandingSitePromoProps {
  onWatch: VoidFunction;
  onVisit: VoidFunction;
  logo: string;
  image: string;
  className?: string;
}

const LandingSitePromo: FunctionComponent<LandingSitePromoProps> = ({
  className,
  onVisit,
  onWatch,
  logo,
  image,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`landing-site-promo-container-placeholder ${className || ""}`}
    >
      <div className="landing-site-promo-container relative py-6 border-1 overflow-hidden">
        <NImage
          className="landing-site-promo-background absolute inset-0 h-full w-full"
          src={image}
        />
        <img
          draggable={false}
          className="landing-site-promo-logo z-10"
          src={logo}
          alt=""
        />
        <div className="action-btn-container mt-auto z-10">
          <button
            className="action-btn px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 bg-n-red hover:bg-red-800"
            onClick={onWatch}
          >
            {t("watchNow")}
          </button>
          <button
            className="action-btn ml-8 px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 text-black bg-white hover:bg-black hover:text-white"
            onClick={onVisit}
          >
            {t("visitSite")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingSitePromo;
