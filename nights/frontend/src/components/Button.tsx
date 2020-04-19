import { FunctionComponent, JSXElementConstructor, DOMAttributes } from "react"
import React from "react"
import { Link } from "react-router-dom"
import { IconBaseProps } from "react-icons"
import "../styles/Button.scss"

export interface ButtonProps {
  to?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
}

export interface InfoButtonProps extends ButtonProps {
  icon: React.ReactElement
}

export const BaseButton: FunctionComponent<ButtonProps> = ({
  to,
  onClick,
  className,
  children,
}) => {
  if (to && onClick) throw Error("Only `to` or `onClick` should be passed.")
  return to ? (
    <Link className={className} to={to}>
      {children}
    </Link>
  ) : (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export const InfoIconButton: FunctionComponent<InfoButtonProps> = ({
  to,
  onClick,
  children,
  icon,
  className,
}) => {
  return (
    <BaseButton
      className={`flex flex-col items-center text-xs text-gray-500 hover:text-white
       ${className}`}
      to={to}
      onClick={onClick}
    >
      {icon}
      {children}
    </BaseButton>
  )
}

const PrimaryButton: FunctionComponent<ButtonProps> = ({
  to,
  onClick,
  children,
  className,
}) => (
  <BaseButton
    to={to}
    onClick={onClick}
    className={`flex items-center px-5 text-sm font-semibold py-2 rounded-full button-container ${className}`}
  >
    {children}
  </BaseButton>
)

export default PrimaryButton
