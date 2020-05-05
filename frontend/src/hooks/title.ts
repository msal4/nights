import { useState } from "react"

import { TitleDetail } from "~core/interfaces/title"

export const useTitleDetail = (value: TitleDetail = null) => {
  const [title, setTitle] = useState<TitleDetail>(value)
  const [error, setError] = useState(null)

  return { title, setTitle, error, setError }
}
