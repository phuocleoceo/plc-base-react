import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { memo, useContext } from 'react'
import { AxiosError } from 'axios'

import { CreateIssueCommentRequest } from '~/features/issue/models'
import { IssueCommentApi } from '~/features/issue/apis'
import { ProfileApi } from '~/features/profile/apis'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Avatar, InputValidation } from '~/common/components'

interface Props {
  issueId: number
}

type FormData = Pick<CreateIssueCommentRequest, 'content'>

function CreateComment(props: Props) {
  const { issueId } = props

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: [QueryKey.PersonalProfile],
    queryFn: () => ProfileApi.getPersonalProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  const user = data?.data.data

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const createProjectMutation = useMutation({
    mutationFn: (body: CreateIssueCommentRequest) => IssueCommentApi.createIssueComment(issueId, body)
  })

  const handleCreateProject = handleSubmit(async (form: FormData) => {
    const projectData: CreateIssueCommentRequest = {
      ...form
    }

    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.IssueComment])
        reset()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  return (
    <>
      <div className='relative flex items-start gap-3 my-4'>
        <Avatar src={user?.avatar} name={user?.displayName} />
        <input
          placeholder='your_comment...'
          className='max-w-[70%] block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
          bg-slate-100 hover:border-gray-400 border-transparent'
          {...register('content')}
        />
      </div>
      <div className='flex justify-end gap-1'>
        <button className='btn'>{createProjectMutation.isLoading ? 'adding...' : 'Add'}</button>
        <button className='btn-crystal hover:bg-slate-200'>cancel</button>
      </div>
    </>
  )
}

export default memo(CreateComment)
