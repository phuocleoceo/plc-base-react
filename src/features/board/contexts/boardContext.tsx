import { Dispatch, SetStateAction, createContext, useState } from 'react'

import { useToggle } from '~/common/hooks'

interface BoardContextInterface {
  selectedIssues: Array<number>
  setSelectedIssues: Dispatch<SetStateAction<Array<number>>>
  isShowingMoveIssueSelect: boolean
  toggleMoveIssueSelect: () => void
}

const initialBoardContext: BoardContextInterface = {
  selectedIssues: [],
  setSelectedIssues: () => null,
  isShowingMoveIssueSelect: false,
  toggleMoveIssueSelect: () => null
}

export const BoardContext = createContext<BoardContextInterface>(initialBoardContext)

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedIssues, setSelectedIssues] = useState<Array<number>>([])
  const { isShowing: isShowingMoveIssueSelect, toggle: toggleMoveIssueSelect } = useToggle()

  return (
    <BoardContext.Provider
      value={{
        selectedIssues,
        setSelectedIssues,
        isShowingMoveIssueSelect,
        toggleMoveIssueSelect
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}
