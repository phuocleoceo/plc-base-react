const environment = import.meta.env.VITE_ENVIRONMENT

export const EnvConfig = {
  PLCBaseUrl: import.meta.env[`VITE_PLC_${environment}_URL`] ?? 'https://base.phuocleoceo.tech',
  HttpTimeout: import.meta.env.VITE_HTTP_TIMEOUT ? Number(import.meta.env.VITE_HTTP_TIMEOUT) : 10000,
  TimeZoneUTC: import.meta.env.VITE_TIMEZONE_UTC ? Number(import.meta.env.VITE_TIMEZONE_UTC) : 7
} as const
