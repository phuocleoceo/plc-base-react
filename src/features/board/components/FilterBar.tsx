import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'

import { GetIssuesInBoardParams, GetIssuesInBacklogParams } from '~/features/issue/models'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { Avatar, SpinningCircle } from '~/common/components'
import { LocalStorageHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

interface Props {
  setIsDragDisabled: Dispatch<SetStateAction<boolean>>
  setIssueParams: Dispatch<SetStateAction<GetIssuesInBoardParams>>
  issueParams: GetIssuesInBoardParams | GetIssuesInBacklogParams
  projectId: number
  maxMemberDisplay: number
}

export default function FilterBar(props: Props) {
  const { setIsDragDisabled, setIssueParams, issueParams, projectId, maxMemberDisplay } = props
  const { isAuthenticated } = useContext(AppContext)
  const currentUser = LocalStorageHelper.getUserInfo()

  const [fold, setFold] = useState(true)
  const [searchValue, setSearchValue] = useState<string>()
  const [selectedMember, setSelectedMember] = useState<number>()

  const { data: projectMemberData, isLoading: projectMemberLoading } = useQuery({
    queryKey: [QueryKey.ProjectMemberSelect, projectId],
    queryFn: () => ProjectMemberApi.getMemberForSelect(projectId),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const projectMembers = projectMemberData?.data.data

  const handleSelectMember = (userId?: number) => {
    setSelectedMember(userId)
    setIssueParams({ ...issueParams, assignees: userId?.toString() ?? '' })
    setIsDragDisabled(!!userId)
  }

  const handleChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setIssueParams({ ...issueParams, searchValue: event.target.value })
    setIsDragDisabled(true)
  }

  const handleClearFilter = () => {
    setIssueParams({ assignees: '', searchValue: '' })
    setIsDragDisabled(false)
    setSelectedMember(undefined)
    setSearchValue('')
  }

  if (projectMemberLoading)
    return (
      <div className='z-10 grid w-full bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <div className='mb-8 flex min-w-fit items-center text-c-5'>
      <div className='relative'>
        <input
          value={searchValue}
          onChange={handleChangeSearchValue}
          placeholder='search_issues'
          className='w-44 rounded-sm border-[1.5px] bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
        />
        <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
      </div>

      {projectMembers && projectMembers.length > 0 && (
        <div className='ml-7 mr-1 flex'>
          {(projectMembers.length > maxMemberDisplay && fold
            ? projectMembers.slice(0, maxMemberDisplay)
            : projectMembers
          ).map(({ id, name, avatar }, idx) => (
            <Avatar
              key={idx}
              src={avatar}
              name={name}
              style={{ zIndex: projectMembers.length - idx }}
              onClick={() => handleSelectMember(id)}
              className={`-ml-2 h-10 w-10 border-2 duration-300 hover:-translate-y-2 ${
                id === selectedMember ? 'border-blue-500 border-2.5' : ''
              }`}
            />
          ))}
          {projectMembers.length > maxMemberDisplay && fold && (
            <button
              onClick={() => setFold(false)}
              className='-ml-2 grid h-10 w-10 items-center rounded-full bg-c-2 pl-2 hover:bg-c-3'
            >
              {projectMembers.length - maxMemberDisplay}+
            </button>
          )}
        </div>
      )}

      {currentUser && (
        <button className='btn-gray shrink-0 bg-slate-100 ml-3' onClick={() => handleSelectMember(currentUser.id)}>
          only_my_issues
        </button>
      )}

      {(selectedMember || searchValue) && (
        <>
          <div className='pb-[2px] mx-3'>|</div>
          <button className='btn-gray shrink-0 bg-slate-100' onClick={handleClearFilter}>
            clear_filter
          </button>
        </>
      )}
    </div>
  )
}
