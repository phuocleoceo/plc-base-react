export const EnvConfig = Object.freeze({
  PLCBaseUrl: import.meta.env.VITE_PLC_BASE_URL ?? 'http://3.0.129.16:7133',
  HttpTimeout: import.meta.env.VITE_HTTP_TIMEOUT ? Number(import.meta.env.VITE_HTTP_TIMEOUT) : 10000
})
