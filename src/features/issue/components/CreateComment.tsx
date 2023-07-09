import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { memo, useContext } from 'react'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { CreateIssueCommentRequest } from '~/features/issue/models'
import { Avatar, RichTextInput } from '~/common/components'
import { IssueCommentApi } from '~/features/issue/apis'
import { ProfileApi } from '~/features/profile/apis'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

interface Props {
  issueId: number
}

type FormData = Pick<CreateIssueCommentRequest, 'content'>

function CreateComment(props: Props) {
  const { issueId } = props

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { isShowing: isShowingCreateComment, toggle: toggleCreateComment } = useToggle()

  const { data } = useQuery({
    queryKey: [QueryKey.PersonalProfile],
    queryFn: () => ProfileApi.getPersonalProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  const user = data?.data.data

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      content: ''
    }
  })

  const createCommentMutation = useMutation({
    mutationFn: (body: CreateIssueCommentRequest) => IssueCommentApi.createIssueComment(issueId, body)
  })

  const handleCreateProject = handleSubmit((form: FormData) => {
    const commentData: CreateIssueCommentRequest = {
      ...form
    }

    if (!commentData.content) {
      toast.warn(t('enter_comment'))
      return
    }

    createCommentMutation.mutate(commentData, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.IssueComment, issueId])
        toggleCreateComment()
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
        {isShowingCreateComment ? (
          <div className='max-w-[80%]'>
            <RichTextInput control={control} controlField='content' />
          </div>
        ) : (
          <input
            onClick={toggleCreateComment}
            placeholder={t('add_your_comment...')}
            className='block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
            bg-slate-100 hover:border-gray-400 border-transparent'
          />
        )}
        <div className='flex flex-col items-start gap-1'>
          {isShowingCreateComment && (
            <>
              <button onClick={handleCreateProject} className='btn w-[4.5rem]'>
                {createCommentMutation.isLoading || isSubmitting ? t('adding...') : t('add')}
              </button>

              <button onClick={toggleCreateComment} className='btn-alert w-[4.5rem]'>
                {t('cancle')}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(CreateComment)
