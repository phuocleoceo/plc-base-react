import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { memo, useContext } from 'react'
import { AxiosError } from 'axios'

import { CreateIssueCommentRequest } from '~/features/issue/models'
import { IssueCommentApi } from '~/features/issue/apis'
import { ProfileApi } from '~/features/profile/apis'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { toast } from 'react-toastify'

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
    formState: { isSubmitting }
  } = useForm<FormData>()

  const createCommentMutation = useMutation({
    mutationFn: (body: CreateIssueCommentRequest) => IssueCommentApi.createIssueComment(issueId, body)
  })

  const handleCreateProject = handleSubmit((form: FormData) => {
    const commentData: CreateIssueCommentRequest = {
      ...form
    }

    if (!commentData.content) {
      toast.warn('enter_comment')
      return
    }

    createCommentMutation.mutate(commentData, {
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
          placeholder='add_your_comment...'
          className='max-w-[80%] block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
          bg-slate-100 hover:border-gray-400 border-transparent'
          {...register('content')}
        />
        <div className='flex justify-end gap-1'>
          <button onClick={handleCreateProject} className='btn'>
            {createCommentMutation.isLoading || isSubmitting ? 'adding...' : 'add'}
          </button>
          <button className='btn-crystal hover:bg-slate-200'>cancel</button>
        </div>
      </div>
    </>
  )
}

export default memo(CreateComment)
