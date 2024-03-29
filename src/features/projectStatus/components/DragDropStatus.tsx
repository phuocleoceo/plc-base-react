import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { ProjectStatus, UpdateProjectStatusRequest } from '~/features/projectStatus/models'
import { DraggableWrapper, DroppableWrapper } from '~/common/components'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { useProjectPermission } from '~/features/project/hooks'
import { DragDropIssue } from '~/features/issue/components'
import { ProjectStatusPermission } from '~/shared/enums'
import { IssueInBoard } from '~/features/issue/models'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

type Props = {
  idx: number
  projectId: number
  projectStatus: ProjectStatus
  issues?: Array<IssueInBoard>
  isDragDisabled: boolean
}

export default function DragDropStatus(props: Props) {
  const { idx, projectId, issues, isDragDisabled, projectStatus } = props

  const { t } = useTranslation()
  const { hasPermission } = useProjectPermission(projectId)
  const queryClient = useQueryClient()

  const { isShowing: isShowingUpdateStatus, toggle: toggleUpdateStatus } = useToggle()
  const { isShowing: isShowingDeleteStatus, toggle: toggleDeleteStatus } = useToggle()

  const [statusData, setStatusData] = useState<UpdateProjectStatusRequest>({
    name: projectStatus.name,
    index: projectStatus.index
  })

  const handleChangeStatusData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusData({
      ...statusData,
      [event.target.name]: event.target.value
    })
  }

  const updateProjectStatusMutation = useMutation({
    mutationFn: (body: UpdateProjectStatusRequest) =>
      ProjectStatusApi.updateProjectStatus(projectId, projectStatus.id, body)
  })

  const handleUpdateProjectStatus = () => {
    const projectStatusData: UpdateProjectStatusRequest = {
      ...statusData
    }

    if (projectStatusData.name === undefined || projectStatusData.index === undefined) {
      toast.warn(t('status_name_required'))
      return
    }

    updateProjectStatusMutation.mutate(projectStatusData, {
      onSuccess: () => {
        toast.success(t('update_status_success'))
        queryClient.invalidateQueries([QueryKey.ProjectStatuses])
        toggleUpdateStatus()
      }
    })
  }

  const deleteProjectStatusMutation = useMutation({
    mutationFn: () => ProjectStatusApi.deleteProjectStatus(projectId, projectStatus.id)
  })

  const handleDeleteProjectStatus = async () => {
    deleteProjectStatusMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('delete_status_success'))
        queryClient.invalidateQueries([QueryKey.ProjectStatuses])
        queryClient.invalidateQueries([QueryKey.IssueInBoard])
        toggleDeleteStatus()
      }
    })
  }

  return (
    <>
      <DraggableWrapper
        className='w-[clamp(16rem,18rem,20rem)]'
        index={idx}
        draggableId={`projectStatus-${projectStatus.id}`}
        isDragDisabled={isDragDisabled || !hasPermission(ProjectStatusPermission.UpdateForBoard)}
      >
        <div className='relative mr-3 bg-c-2 p-3 text-c-5 shadow-list'>
          <div className='mb-4 flex items-center justify-between text-[15px]'>
            <div className='item-center flex'>
              <div className='relative'>
                {isShowingUpdateStatus && hasPermission(ProjectStatusPermission.Update) ? (
                  <input
                    value={statusData.name}
                    name='name'
                    onChange={handleChangeStatusData}
                    className='w-36 border-[1.5px] pl-2 text-[15px] outline-none focus:border-chakra-blue'
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                ) : (
                  <span className='block border-[1.5px] border-transparent pl-2 font-medium'>{projectStatus.name}</span>
                )}
              </div>

              {isShowingUpdateStatus ? (
                <>
                  {hasPermission(ProjectStatusPermission.Update) && (
                    <button onClick={handleUpdateProjectStatus} title='save' className='btn-icon hover:bg-c-3 ml-2'>
                      <Icon icon='charm:tick' className='text-green-500' />
                    </button>
                  )}

                  {hasPermission(ProjectStatusPermission.Delete) && (
                    <button onClick={toggleDeleteStatus} title='delete' className='btn-icon hover:bg-c-3'>
                      <Icon icon='bx:trash' className='text-red-500' />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className='mx-2 text-gray-500'>|</span>
                  <span className='text-c-4 pt-[1px] font-bold'>{issues ? issues.length : 0}</span>
                </>
              )}
            </div>

            <div className='flex gap-2'>
              {isShowingUpdateStatus ? (
                <button onClick={toggleUpdateStatus} title='cancle' className='btn-icon hover:bg-c-3'>
                  <Icon icon='ion:close-sharp' className='text-blue-500' />
                </button>
              ) : (
                (hasPermission(ProjectStatusPermission.Update) || hasPermission(ProjectStatusPermission.Delete)) && (
                  <button onClick={toggleUpdateStatus} title='edit' className='btn-icon hover:bg-c-3'>
                    <Icon icon='akar-icons:edit' />
                  </button>
                )
              )}
            </div>
          </div>

          <DroppableWrapper
            className='min-h-[3rem]'
            type='issueBoard'
            droppableId={`projectStatus-${projectStatus.id}`}
          >
            {issues?.map((issue, idx) => (
              <DragDropIssue key={issue.id} isDragDisabled={isDragDisabled} {...{ idx, issue, projectId }} />
            ))}
          </DroppableWrapper>
        </div>
      </DraggableWrapper>

      {isShowingDeleteStatus && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteStatus}
            onClose={toggleDeleteStatus}
            onSubmit={handleDeleteProjectStatus}
            isMutating={deleteProjectStatusMutation.isLoading}
            confirmMessage={t(`submit_delete_status`) + `: ${projectStatus.name}`}
            closeLabel={t('cancle')}
            submittingLabel={t('deleting_status...')}
            submitLabel={t('delete_status')}
            submitClassName='btn-alert'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
