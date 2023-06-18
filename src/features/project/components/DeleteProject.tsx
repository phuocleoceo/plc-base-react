import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useState } from 'react'

import { ProjectApi } from '~/features/project/apis'
import { QueryKey } from '~/shared/constants'
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

  const [typeContent, setTypeContent] = useState<string>('')

  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const deleteProjectMutation = useMutation({
    mutationFn: () => ProjectApi.deleteProject(project?.id ?? -1)
  })

  const handleDeleteProject = async () => {
    deleteProjectMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('delete_project_success'))
        queryClient.invalidateQueries([QueryKey.Projects])
        onClose()
        navigate('/')
      }
    })
  }

  const handleChangeTypeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeContent(event.target.value)
  }

  return (
    <Modal
      onSubmit={handleDeleteProject}
      isMutating={deleteProjectMutation.isLoading}
      closeLabel={t('cancle')}
      submittingLabel={t('deleting_project...')}
      submitLabel={t('delete_project')}
      submitClassName='btn-alert'
      submitDisable={typeContent !== project.name}
      {...{ isShowing, onClose }}
    >
      <div>
        <label htmlFor={project.name} className='text-sm tracking-wide text-gray-800'>
          {t(`type_project_name_to_delete`) + `: ${project.name}`}
        </label>
        <input
          value={typeContent}
          onChange={handleChangeTypeContent}
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
