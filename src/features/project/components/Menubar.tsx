import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

import {
  EventPermission,
  InvitationPermission,
  IssuePermission,
  ProjectMemberPermission,
  ProjectPermission
} from '~/shared/enums'
import { useCurrentProject, useProjectPermission } from '~/features/project/hooks'
import { Avatar, IconLink, SpinningCircle } from '~/common/components'
import { useToggle } from '~/common/hooks'

export default function Menubar() {
  const projectId = Number(useParams().projectId)

  // host/project/:projectId/currentTab
  const currentTab = useLocation().pathname.split('/')[3]

  const { hasPermission } = useProjectPermission(projectId)

  const { isShowing, toggle } = useToggle(true)

  const { t } = useTranslation()

  const { currentProject, isLoadingProject } = useCurrentProject(projectId)

  return (
    <motion.div
      initial={{ width: projectId ? 240 : 15 }}
      animate={{ width: projectId && isShowing ? 240 : 15 }}
      transition={{ type: 'tween' }}
      className='relative bg-c-2'
    >
      {projectId &&
        (isLoadingProject ? (
          <div className='flex justify-center'>
            <SpinningCircle height={40} width={40} />
          </div>
        ) : (
          <div className='h-full w-[15rem] bg-c-2 px-4 py-6'>
            <div className='flex'>
              <div className='grid h-10 w-10 shrink-0 place-items-center text-lg'>
                <Avatar
                  title={currentProject?.name}
                  src={currentProject?.image}
                  name={currentProject?.name}
                  className='h-9 w-9 border-[1px] hover:border-green-500'
                />
              </div>

              <div className='ml-2 w-40'>
                <span className='block truncate text-sm font-medium text-c-5'>{currentProject?.name}</span>
                <span className='text-[13px] text-c-text'>{t('project_planning')}</span>
              </div>
            </div>

            <div className='mt-5 mb-2'>
              {hasPermission(IssuePermission.GetForBoard) && (
                <IconLink
                  to={`/project/${projectId}/board`}
                  icon='bi:kanban'
                  text={t('kanban_board')}
                  isActive={currentTab === 'board'}
                />
              )}

              {hasPermission(IssuePermission.GetForBacklog) && (
                <IconLink
                  to={`/project/${projectId}/backlog`}
                  icon='fluent-mdl2:backlog-list'
                  text={t('backlog')}
                  rotate={180}
                  isActive={currentTab === 'backlog'}
                />
              )}

              {hasPermission(EventPermission.GetAll) && (
                <IconLink
                  to={`/project/${projectId}/event`}
                  icon='ic:outline-event-note'
                  text={t('event')}
                  isActive={currentTab === 'event'}
                  iconSize={24}
                />
              )}

              {hasPermission(ProjectMemberPermission.GetAll) && (
                <IconLink
                  to={`/project/${projectId}/member`}
                  icon='mdi:people'
                  text={t('member')}
                  isActive={currentTab === 'member'}
                />
              )}

              {hasPermission(InvitationPermission.GetForProject) && (
                <IconLink
                  to={`/project/${projectId}/invitation`}
                  icon='cib:telegram-plane'
                  text={t('invitation')}
                  isActive={currentTab === 'invitation'}
                />
              )}
            </div>

            <hr className='border-t-[.5px] border-gray-400' />

            <div className='mt-2'>
              {hasPermission(ProjectPermission.GetOne) && (
                <IconLink
                  to={`/project/${projectId}/setting`}
                  icon='clarity:settings-solid'
                  text={t('project_setting')}
                  isActive={currentTab === 'setting'}
                />
              )}
            </div>
          </div>
        ))}

      <button
        title='toggle_project_menubar'
        onClick={toggle}
        className={`border-zinc-text00 group peer absolute -right-[14px] top-8 z-[20] grid h-7 w-7 place-items-center rounded-full border-[1px] bg-c-1 hover:border-secondary hover:bg-secondary ${
          projectId && currentProject ? '' : 'pointer-events-none'
        }`}
      >
        <Icon
          className='text-secondary group-hover:text-white'
          icon={isShowing ? 'fa-solid:angle-left' : 'fa-solid:angle-right'}
        />
      </button>
      <div className='absolute top-0 right-0 h-full w-[2px] bg-c-3 peer-hover:bg-secondary' />
    </motion.div>
  )
}
