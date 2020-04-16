import React, { FunctionComponent } from "react"

export type SvgContainerProps = {
  width?: string
  height?: string
  fill?: string
  style?: {}
  className?: string
}

const SvgContainer: FunctionComponent<SvgContainerProps> = ({
  width = "1rem",
  height = "1rem",
  fill = "black",
  style,
  className,
  children,
}) => (
  <div className={className} style={{ width, height, fill, ...style }}>
    {children}
  </div>
)

export default SvgContainer
