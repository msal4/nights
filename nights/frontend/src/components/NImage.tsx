import React, { FunctionComponent } from "react"

type ImageProps = React.ComponentProps<"img">

const Image: FunctionComponent<ImageProps> = ({
  children,
  className,
  src,
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
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Image
