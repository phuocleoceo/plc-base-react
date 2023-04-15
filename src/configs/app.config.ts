import { EnvConfig } from './env.config'

export const AppConfig = {
  PLCBaseApi: `${EnvConfig.PLCBaseUrl}/api/`
} as const
