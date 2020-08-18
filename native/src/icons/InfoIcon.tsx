import React, { FunctionComponent } from "react"

const InfoIcon: FunctionComponent<{
  width?: string
  height?: string
  fill?: string
  style?: {}
  className?: string
}> = ({
  width = "1rem",
  height = "1rem",
  fill = "black",
  style,
  className,
}) => (
  <div className={className} style={{ width, height, fill, ...style }}>
    {" "}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path d="M256 0C114.51 0 0 114.497 0 256c0 141.49 114.497 256 256 256 141.49 0 256-114.497 256-256C512 114.51 397.503 0 256 0zm0 477.867c-122.337 0-221.867-99.529-221.867-221.867S133.663 34.133 256 34.133 477.867 133.663 477.867 256 378.337 477.867 256 477.867z"></path>
      <path d="M255.997 209.777c-9.425 0-17.067 7.641-17.067 17.067v143.969c0 9.425 7.641 17.067 17.067 17.067s17.067-7.641 17.067-17.067v-143.97c-.001-9.426-7.642-17.066-17.067-17.066zM256 124.122c-18.821 0-34.133 15.312-34.133 34.133s15.312 34.133 34.133 34.133 34.133-15.312 34.133-34.133-15.312-34.133-34.133-34.133z"></path>
    </svg>
  </div>
)

export default InfoIcon
