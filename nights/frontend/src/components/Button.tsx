import { FunctionComponent, JSXElementConstructor, DOMAttributes } from "react"
import React from "react"
import { Link } from "react-router-dom"
import { IconBaseProps } from "react-icons"

export interface ButtonProps {
  to?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
}

const IconButton: FunctionComponent<ButtonProps> = ({
  to,
  onClick,
  children,
  className,
}) => {
  if (to && onClick) throw Error("Only one prop should be passed.")
  const classes = `px-3 py-2 ${className}`

  return to ? (
    <Link
      className="flex items-center px-5 text-sm font-semibold py-2 rounded-full"
      style={{ boxShadow: "0 0 10px red", background: "#EA1437" }}
      to={to}
    >
      {children}
    </Link>
  ) : (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton
