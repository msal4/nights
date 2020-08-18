import React, { FunctionComponent } from "react"

const PlusIcon: FunctionComponent<{
  width?: string
  height?: string
  fill?: string
  style?: {}
  className?: string
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void | Promise<void>
}> = ({
  width = "1rem",
  height = "1rem",
  fill = "black",
  style,
  className,
  onClick,
}) => (
  <div
    className={className}
    style={{ width, height, fill, ...style }}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 409.6 409.6"
      version="1.1"
      viewBox="0 0 409.6 409.6"
      xmlSpace="preserve"
    >
      <path d="M392.533 187.733H221.867V17.067C221.867 7.641 214.226 0 204.8 0s-17.067 7.641-17.067 17.067v170.667H17.067C7.641 187.733 0 195.374 0 204.8s7.641 17.067 17.067 17.067h170.667v170.667c0 9.426 7.641 17.067 17.067 17.067s17.067-7.641 17.067-17.067V221.867h170.667c9.426 0 17.067-7.641 17.067-17.067s-7.643-17.067-17.069-17.067z"></path>
    </svg>
  </div>
)

export default PlusIcon
