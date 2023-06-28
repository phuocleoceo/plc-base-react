import { Dispatch, SetStateAction, createContext, useState } from 'react'

import { Project } from '~/features/project/models'

interface ProjectContextInterface {
  currentProject: Project | undefined
  setCurrentProject: Dispatch<SetStateAction<Project | undefined>>
}

const initialProjectContext: ProjectContextInterface = {
  currentProject: undefined,
  setCurrentProject: () => null
}

export const ProjectContext = createContext<ProjectContextInterface>(initialProjectContext)

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentProject, setCurrentProject] = useState<Project | undefined>()

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
