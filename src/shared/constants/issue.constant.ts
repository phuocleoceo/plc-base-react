import CodingTaskIcon from '~/assets/svg/coding-task.svg'
import BugIcon from '~/assets/svg/bug.svg'
import UserStoryIcon from '~/assets/svg/user-story.svg'
import LowIcon from '~/assets/svg/low.svg'
import MediumIcon from '~/assets/svg/medium.svg'
import HighIcon from '~/assets/svg/high.svg'
import CriticalIcon from '~/assets/svg/critical.svg'

export const IssueType = [
  { label: 'coding_task', value: 'coding_task', icon: CodingTaskIcon },
  { label: 'bug', value: 'bug', icon: BugIcon },
  { label: 'user_story', value: 'user_story', icon: UserStoryIcon }
]

export const IssuePriority = [
  { label: 'low', value: 'low', icon: LowIcon },
  { label: 'medium', value: 'medium', icon: MediumIcon },
  { label: 'high', value: 'high', icon: HighIcon },
  { label: 'critical', value: 'critical', icon: CriticalIcon }
]
