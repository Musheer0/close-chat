"use client"
import { useEffect, useState } from "react"

export function useIsMobile(breakpoint: number = 768) {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : breakpoint + 1
  )
  const [isMobile, setIsMobile] = useState(true) // separate state, default true

  useEffect(() => {
    function handleResize() {
      const newWidth = window.innerWidth
      setWidth(newWidth)
      setIsMobile(newWidth <= breakpoint) // update based on width
    }

    // run once on mount to sync correctly
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [breakpoint])

  return {
    width,
    isMobile,
  }
}
