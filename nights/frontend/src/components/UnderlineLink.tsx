import React, { FunctionComponent } from "react"
import { useRouteMatch, Link } from "react-router-dom"

export interface UnderlineLinkProps {
  to: string
  activeOnlyWhenExact?: boolean
  className?: string
}

const UnderlineLink: FunctionComponent<UnderlineLinkProps> = ({
  to,
  className = "",
  activeOnlyWhenExact = true,
  children,
}) => {
  const match = useRouteMatch({ path: to, exact: activeOnlyWhenExact })
  return (
    <Link
      className={`underline-before ${
        match ? "highlight-before" : ""
      } ${className}`}
      to={to}
    >
      {children}
    </Link>
  )
}

export default UnderlineLink
