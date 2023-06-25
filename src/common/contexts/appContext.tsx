import { createContext, useState } from 'react'

import { LocalStorageHelper } from '~/shared/helpers'
import { useToggle } from '../hooks'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isShowingProfile: boolean
  toggleProfile: () => void
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(LocalStorageHelper.getAccessToken()),
  setIsAuthenticated: () => null,
  isShowingProfile: false,
  toggleProfile: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const { isShowing: isShowingProfile, toggle: toggleProfile } = useToggle()

  const reset = () => {
    setIsAuthenticated(false)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isShowingProfile,
        toggleProfile,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
