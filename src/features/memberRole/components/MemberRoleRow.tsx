import { ProjectRole } from '~/features/admin/features/projectRole/models'
import { SwitchToggle } from '~/common/components'

interface Props {
  projectMemberId: number
  projectRole: ProjectRole
  isMemberGranted: boolean
}

export default function MemberRoleModal(props: Props) {
  const { projectMemberId, projectRole, isMemberGranted } = props

  const handleToggle = (isEnable: boolean) => {
    console.log(isEnable)
  }

  return (
    <div key={projectRole.id} className='flex justify-between p-3'>
      <p>
        {projectRole.name} - {projectRole.description}
      </p>
      <SwitchToggle defaultValue={isMemberGranted} onClick={handleToggle} />
    </div>
  )
}
