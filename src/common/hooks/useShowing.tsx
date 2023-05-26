import { useState } from 'react'

export default function useShowing(defaultState = false) {
  const [isShowing, setIsShowing] = useState(defaultState)

  const toggle = () => setIsShowing(!isShowing)

  return {
    isShowing,
    toggle
  }
}
