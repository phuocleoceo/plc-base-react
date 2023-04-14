export const EnvConfig = Object.freeze({
  PLCBaseUrl: import.meta.env.VITE_PLC_BASE_URL ?? 'https://base.phuocleoceo.tech',
  HttpTimeout: import.meta.env.VITE_HTTP_TIMEOUT ? Number(import.meta.env.VITE_HTTP_TIMEOUT) : 10000
})
