import { EnvConfig } from './envConfig'

export const AppConfig = {
  PLCBaseApi: `${EnvConfig.PLCBaseUrl}/api/`
} as const
