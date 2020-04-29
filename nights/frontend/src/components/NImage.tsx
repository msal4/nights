import React, { FunctionComponent } from "react"

type ImageProps = React.ComponentProps<"img">

const NImage: FunctionComponent<ImageProps> = ({
  children,
  className,
  src,
  style,
  ...props
}) => {
  const fallback = "/static/frontend/images/fallback.jpg"
  return (
    <div
      className={`relative ${className} overflow-hidden`}
      style={{
        background: `url(${src}), url(${fallback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default NImage
