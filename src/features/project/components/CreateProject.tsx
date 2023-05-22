import { FieldError, FieldValues, useForm } from 'react-hook-form'

import { InputValidation, Modal } from '~/common/components'

interface Props {
  isShowing: boolean
  onClose: () => void
}

export default function CreateProject(props: Props) {
  const { isShowing, onClose } = props

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading }
  } = useForm()

  const handleCreateProject = async (form: FieldValues) => {
    onClose()
  }

  return (
    <Modal onSubmit={handleSubmit(handleCreateProject)} {...{ isShowing, onClose, isLoading }}>
      <>
        <div className='mb-8'>
          <span className='text-[22px] font-[600] text-c-text'>Create Project</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputValidation
            label='Project name'
            placeholder='name of your project'
            register={register('name', {
              required: {
                value: true,
                message: 'Project name must not be empty'
              }
            })}
            error={errors.name as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <InputValidation
            label='Short description'
            placeholder='describe your project in a few words'
            register={register('descr')}
            error={errors.descr as FieldError}
          />
          <InputValidation
            label='Repository link'
            placeholder="link to the Project's repository"
            register={register('repo')}
            error={errors.repo as FieldError}
          />
        </div>
        {/* {authUser && (
          <WithLabel label="Members">
            <>
              <div className="mb-2 rounded-sm border-[1px] border-gray-300 bg-slate-100 py-1 px-3 text-sm text-c-text">
                <Item
                  text={authUser.username}
                  icon={authUser.profileUrl}
                  size="h-6 w-6"
                  variant="ROUND"
                />
              </div>
              <span className="text-sm text-c-text">
                * you can add more members after creating the project *
              </span>
            </>
          </WithLabel>
        )} */}
      </>
    </Modal>
  )
}
