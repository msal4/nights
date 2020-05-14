import { FunctionComponent } from "react"
import React from "react"
import { Link } from "react-router-dom"

import "../../styles/Buttons.scss"

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
  className = "",
}) => {
  return (
    <BaseButton
      className={`flex flex-col items-center text-xs opacity-50 hover:opacity-100 text-xl
       ${className}`}
      to={to}
      onClick={onClick}
    >
      {icon}
      {children}
    </BaseButton>
  )
}

export const PrimaryButton: FunctionComponent<ButtonProps> = ({
  to,
  onClick,
  children,
  className,
}) => (
  <BaseButton
    to={to}
    onClick={onClick}
    className={`flex items-center px-10 py-4 text-lg font-bold rounded-full button-container ${className}`}
  >
    {children}
  </BaseButton>
)
