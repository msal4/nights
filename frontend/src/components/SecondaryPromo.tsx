import React, { FunctionComponent } from "react";

import "../styles/SecondaryPromo.scss";

export interface SecondaryPromoProps {
  title: string;
  body: string;
  image: string;
  rtl?: boolean;
}

const SecondaryPromo: FunctionComponent<SecondaryPromoProps> = ({
  title,
  body,
  image,
  rtl,
}) => {
  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center"
      dir={rtl ? "rtl" : "ltr"}
      style={{ height: "30rem", borderBottom: "1px solid #ffffff44" }}
    >
      <img className="promo-img object-cover" src={image} alt="" />
      <div className={`mt-10 ${rtl ? "md:mr-24" : "md:ml-24"} max-w-xs`}>
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="mt-2 font-thin">{body}</p>
      </div>
    </div>
  );
};

export default SecondaryPromo;
