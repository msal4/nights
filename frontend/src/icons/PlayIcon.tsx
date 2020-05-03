import React from "react"
import SvgContainer, { SvgContainerProps } from "./SvgContainer"

export default (props: SvgContainerProps) => (
  <SvgContainer
    style={{
      fill: "#ea1437",
      background: "white",
      borderRadius: "50%",
      maxWidth: "3rem",
      maxHeight: "3rem",
      minWidth: "3rem",
      minHeight: "3rem",
    }}
    width="3rem"
    height="3rem"
    {...props}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 565.648 565.648">
      <path d="M282.824 0C126.877 0 0 126.877 0 282.824s126.877 282.824 282.824 282.824 282.824-126.877 282.824-282.824S438.771 0 282.824 0zm-70.706 424.233V141.411l212.118 141.41z"></path>
    </svg>
  </SvgContainer>
)
