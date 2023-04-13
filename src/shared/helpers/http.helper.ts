import axios, { AxiosError, type AxiosInstance } from 'axios'
import { EnvConfig, AppConfig } from '~/configs'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: AppConfig.PLCBaseApi,
      timeout: EnvConfig.HttpTimeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }
}

export default new Http().instance
