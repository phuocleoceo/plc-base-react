import { useState } from 'react'

export default function useToggle(defaultState = false) {
  const [isShowing, setIsShowing] = useState(defaultState)

  const toggle = () => setIsShowing(!isShowing)

  return {
    isShowing,
    toggle
  }
}
