import {FunctionComponent} from "react"
import React from "react"

import '~/styles/LandingSitePromo.scss'
import {useTranslation} from "react-i18next"

export interface LandingSitePromoProps {
  title: string
  url: string
  action: () => void
  logo: string
  image: string
  className?: string
}


const LandingSitePromo: FunctionComponent<LandingSitePromoProps> = ({title, className, url, action, logo, image}) => {

  const {t} = useTranslation()

  return (
    <div className={`landing-site-promo-container-placeholder ${className || ''}`}>
      <div className="landing-site-promo-container relative py-6 border-1 overflow-hidden" >
        <img draggable={false} className="landing-site-promo-background absolute inset-0 h-full w-full" style={{objectFit: 'cover'}} src={"/static/frontend/images/mulan.png"} />
        <img draggable={false} className="landing-site-promo-logo z-10" src={logo} />
        <div className="mt-auto z-10">
          <button className="action-btn px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 bg-n-red hover:bg-red-800" onClick={action}>
            {t('watchNow'}
          </button>
          <button className="action-btn ml-8 px-8 py-3 rounded-full text-sm font-semibold shadow-xl transition-background duration-200 text-black bg-white hover:bg-black hover:text-white" onClick={action}>
            {t('visitSite')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingSitePromo
