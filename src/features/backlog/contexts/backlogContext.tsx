import { Dispatch, SetStateAction, createContext, useState } from 'react'

import { useToggle } from '~/common/hooks'

interface BacklogContextInterface {
  selectedIssues: Array<number>
  setSelectedIssues: Dispatch<SetStateAction<Array<number>>>
  isShowingMoveIssueSelect: boolean
  toggleMoveIssueSelect: () => void
  isShowingMoveIssueModal: boolean
  toggleMoveIssueModal: () => void
}

const initialBacklogContext: BacklogContextInterface = {
  selectedIssues: [],
  setSelectedIssues: () => null,
  isShowingMoveIssueSelect: false,
  toggleMoveIssueSelect: () => null,
  isShowingMoveIssueModal: false,
  toggleMoveIssueModal: () => null
}

export const BacklogContext = createContext<BacklogContextInterface>(initialBacklogContext)

export const BacklogProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedIssues, setSelectedIssues] = useState<Array<number>>([])
  const { isShowing: isShowingMoveIssueSelect, toggle: toggleMoveIssueSelect } = useToggle()
  const { isShowing: isShowingMoveIssueModal, toggle: toggleMoveIssueModal } = useToggle()

  return (
    <BacklogContext.Provider
      value={{
        selectedIssues,
        setSelectedIssues,
        isShowingMoveIssueSelect,
        toggleMoveIssueSelect,
        isShowingMoveIssueModal,
        toggleMoveIssueModal
      }}
    >
      {children}
    </BacklogContext.Provider>
  )
}
