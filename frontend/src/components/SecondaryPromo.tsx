import React, {FunctionComponent} from "react";


export interface SecondaryPromoProps {
  title: string
  body: string
  image: string
  rtl?: boolean
}

const SecondaryPromo: FunctionComponent<SecondaryPromoProps> = ({title, body, image, rtl}) => {

  return (
    <div className="flex items-center justify-center" dir={rtl ? "rtl" : "ltr"}
      style={{height: '30rem', borderBottom: '1px solid #ffffff44'}}
    >
      <img className="object-cover" src={image} style={{width: '35rem'}} />
      <div className={`${rtl ? 'mr-24' : 'ml-24'} max-w-xs`}>
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="mt-2 font-thin">{body}</p>
      </div>
    </div>
  )
}


export default SecondaryPromo
