import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

import LandingSitePromo from "../components/LandingSitePromo";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import LoginPage from "./LoginPage";
import CWPage from "./CWPage";
import SecondaryPromo from "../components/SecondaryPromo";
import { LandingPromo, ChannelPromo } from "../core/interfaces/promo";
import { useDisposableEffect } from "../hooks";
import { getLandingPromos, getChannelPromo } from "../api/promo";
import { getPromos } from "../api/home";
import { TitleDetail, ImageQuality } from "../core/interfaces/title";
import { getImageUrl } from "../utils/common";
import LoginOrRegisterPage from "./LoginOrRegisterPage";

export default () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { t, i18n } = useTranslation();
  const { landingPromos, nightsPromo, channelPromo } = usePromos();

  return (
    <div id="landing-page-container">
      <div id="promo-main-section" style={{ height: "calc(100vh - 8.2rem)" }}>
        <div
          className="absolute top-0 left-0 right-0 h-screen"
          style={{
            backgroundImage: `url(/static/frontend/images/landing_background.jpg)`,
            backgroundSize: "cover",
            zIndex: -1,
          }}
        />

        <div className="mx-auto max-w-5xl">
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between">
            {nightsPromo && (
              <LandingSitePromo
                onVisit={() => history.push("/home")}
                onWatch={() =>
                  history.push(
                    nightsPromo.type === "m"
                      ? `/movie/${nightsPromo.id}/play`
                      : `/series/${nightsPromo.id}/auto/auto/play`
                  )
                }
                image={
                  getImageUrl(nightsPromo.images[0].url, ImageQuality.h900) ||
                  ""
                }
                logo="/static/frontend/images/nights_logo_white.svg"
              />
            )}

            {channelPromo && (
              <LandingSitePromo
                onVisit={() =>
                  (window.location.href = `http://tv.sawadland.com`)
                }
                onWatch={() =>
                  (window.location.href = `http://tv.sawadland.com/channel/${channelPromo.channel_id}`)
                }
                logo="/static/frontend/images/tv_logo_white.svg"
                image={`http://tv.sawadland.com${channelPromo.promo_image}`}
              />
            )}
          </div>

          <div className="mt-4">
            <Switch>
              <Route path={`${url}/login_or_register`}>
                <LoginOrRegisterPage />
              </Route>
              <Route path={`${url}/login`}>
                <LoginPage type="login" />
              </Route>
              <Route path={`${url}/register`}>
                <LoginPage type="register" />
              </Route>
              <Route path={url}>
                <CWPage />
              </Route>
            </Switch>
          </div>

          <IoIosArrowDown
            className="scroll-down-arrow absolute mx-auto text-sm"
            style={{
              left: "50%",
              bottom: "1rem",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      <div className="mx--1">
        <div
          className="relative flex flex-column items-center justify-center bg-white text-black"
          style={{ zIndex: 1000, height: "30rem" }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <img
              src="/static/frontend/images/devices_promo.png"
              style={{ width: "20rem" }}
              alt=""
            />
            <div className="text-center md:text-left mt-10 md:ml-32 max-w-xs">
              <h1 className="font-semibold text-lg">
                {t("availableNowOnAllDevices")}
              </h1>
              <p className="mt-2 text-sm font-thin">
                {t("enjoyAllYourFavoriteMedia")}
              </p>
              <div className="mt-6 flex items-center">
                <img
                  className="w-32"
                  src="/static/frontend/images/google_play_white.png"
                  alt=""
                />
                <img
                  className="ml-4 w-32"
                  src="/static/frontend/images/ios_app_store_white.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-56 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(270deg, #00000000 -10%, #18001F 60%) 0% 0% no-repeat padding-box, url(/static/frontend/images/media_promo.png)",
          }}
        >
          <img
            className="h-30"
            src="/static/frontend/images/media_logo.svg"
            alt=""
          />
          <div className="ml-24 max-w-sm">
            <h1 className="font-semibold text-lg">
              {t("downloadYourEssentials")}
            </h1>
            <p className="mt-2 font-thin">{t("pcSoftwareGames")}</p>
            <a
              className="mt-4 inline-block px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 text-black bg-white hover:bg-black hover:text-white"
              href="http://172.18.0.196"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("visitSite")}
            </a>
          </div>
        </div>

        {landingPromos &&
          landingPromos.map((promo: LandingPromo, index: number) => (
            <SecondaryPromo
              key={promo.id}
              title={i18n.language === "ar" ? promo.title_ar : promo.title}
              body={i18n.language === "ar" ? promo.body_ar : promo.body}
              image={promo.image}
              rtl={index % 2 === 0}
            />
          ))}
      </div>
    </div>
  );
};

const usePromos = () => {
  const [landingPromos, setLandingPromos] = useState<LandingPromo[] | null>(
    null
  );
  const [nightsPromo, setNightsPromo] = useState<TitleDetail | null>(null);
  const [channelPromo, setChannelPromo] = useState<ChannelPromo | null>(null);

  const getData = async (disposed: boolean) => {
    try {
      const landingPromosRes = await getLandingPromos();
      !disposed && setLandingPromos(landingPromosRes);

      const nightsPromoRes = await getPromos({ limit: 1 });
      !disposed && setNightsPromo(nightsPromoRes[0]);

      const channelPromoRes = await getChannelPromo();
      !disposed && setChannelPromo(channelPromoRes);
    } catch (error) {
      console.log("😔", error);
    }
  };

  useDisposableEffect((disposed) => {
    getData(disposed);
  }, []);

  return { landingPromos, nightsPromo, channelPromo };
};

