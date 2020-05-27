import { useEffect } from "react"

export const useDisposableEffect = (
  effect: (disposed: boolean) => void | (() => void),
  dependencies?: any[]
) => {
  let disposed: boolean
  useEffect(() => {
    disposed = false
    const cleanEffect = effect(disposed)

    return () => {
      disposed = true
      if (typeof cleanEffect === "function") {
        cleanEffect()
      }
    }
  }, dependencies)
}
