import { Dispatch, SetStateAction, createContext, useState } from 'react'

import { useToggle } from '~/common/hooks'

interface BoardContextInterface {
  selectedIssues: Array<number>
  setSelectedIssues: Dispatch<SetStateAction<Array<number>>>
  isShowingMoveIssueSelect: boolean
  toggleMoveIssueSelect: () => void
  isShowingMoveIssueModal: boolean
  toggleMoveIssueModal: () => void
}

const initialBoardContext: BoardContextInterface = {
  selectedIssues: [],
  setSelectedIssues: () => null,
  isShowingMoveIssueSelect: false,
  toggleMoveIssueSelect: () => null,
  isShowingMoveIssueModal: false,
  toggleMoveIssueModal: () => null
}

export const BoardContext = createContext<BoardContextInterface>(initialBoardContext)

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedIssues, setSelectedIssues] = useState<Array<number>>([])
  const { isShowing: isShowingMoveIssueSelect, toggle: toggleMoveIssueSelect } = useToggle()
  const { isShowing: isShowingMoveIssueModal, toggle: toggleMoveIssueModal } = useToggle()

  return (
    <BoardContext.Provider
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
    </BoardContext.Provider>
  )
}
