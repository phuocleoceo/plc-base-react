import { useState } from 'react'

export default function useShowing() {
  const [isShowing, setIsShowing] = useState(false)

  const toggle = () => setIsShowing(!isShowing)

  return {
    isShowing,
    toggle
  }
}
