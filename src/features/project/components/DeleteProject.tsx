import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ProjectApi } from '~/features/project/apis'
import { Modal } from '~/common/components'

interface Props {
  project: {
    id?: number
    name?: string
  }
  isShowing: boolean
  onClose: () => void
}

export default function DeleteProject(props: Props) {
  const { project, isShowing, onClose } = props

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const deleteProjectMutation = useMutation({
    mutationFn: () => ProjectApi.deleteProject(project?.id ?? -1)
  })

  const handleDeleteProject = async () => {
    deleteProjectMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_success')
        queryClient.invalidateQueries(['projects'])
        onClose()
        navigate('/')
      },
      onError: () => {
        toast.success('delete_project_fail')
      }
    })
  }

  return (
    <Modal
      onSubmit={handleDeleteProject}
      isLoading={deleteProjectMutation.isLoading}
      closeLabel='cancle'
      submittingLabel='deleting_project...'
      submitLabel='delete_project'
      submitClassName='btn-alert'
      {...{ isShowing, onClose }}
    >
      <div>
        <label htmlFor={project.name} className='text-sm tracking-wide text-gray-800'>
          {`type_project_name_for_delete` + `: ${project.name}`}
        </label>
        <input
          id={project.name}
          className='mt-5 block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none 
                      duration-200 focus:border-chakra-blue bg-slate-100 hover:border-gray-400'
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </div>
    </Modal>
  )
}
