import React, {FunctionComponent} from "react"

type ImageProps = React.ComponentProps<"img">

const NImage: FunctionComponent<ImageProps> = ({
  children,
  className,
  src,
  style,
  ...props
}) => {
  const fallback = "/static/frontend/images/fallback.jpeg"
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${src}), url(${fallback})`,
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
