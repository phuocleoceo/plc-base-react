import CodingTaskIcon from '~/assets/svg/coding-task.svg'
import BugIcon from '~/assets/svg/bug.svg'
import UserStoryIcon from '~/assets/svg/user-story.svg'
import LowIcon from '~/assets/svg/low.svg'
import MediumIcon from '~/assets/svg/medium.svg'
import HighIcon from '~/assets/svg/high.svg'
import CriticalIcon from '~/assets/svg/critical.svg'

export const IssueType = [
  { text: 'coding_task', value: 'coding_task', icon: CodingTaskIcon },
  { text: 'bug', value: 'bug', icon: BugIcon },
  { text: 'user_story', value: 'user_story', icon: UserStoryIcon }
]

export const IssuePriority = [
  { text: 'low', value: 'low', icon: LowIcon },
  { text: 'medium', value: 'medium', icon: MediumIcon },
  { text: 'high', value: 'high', icon: HighIcon },
  { text: 'critical', value: 'critical', icon: CriticalIcon }
]
