import React from "react"
import SvgContainer, { SvgContainerProps } from "./SvgContainer"
import { FaPlay } from "react-icons/fa"

export default (props: SvgContainerProps) => (
  <div
    {...props}
    className={`relative rounded-full bg-n-red hover:bg-n-blue ${props.className}`}
    style={{ width: "3rem", height: "3rem" }}
  >
    <FaPlay
      style={{
        position: "absolute",
        left: "53%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  </div>
)
