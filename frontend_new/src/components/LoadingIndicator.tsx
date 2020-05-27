import React from "react"
import "../styles/LoadingIndicator.scss"

export default ({ show }: { show: boolean }) =>
  show && <div className="h-1 loading-indicator" />
