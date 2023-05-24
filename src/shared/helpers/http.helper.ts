import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import queryString from 'query-string'

import * as LocalStorageHelper from './localStorage.helper'
import * as TypeCheckHelper from './typeCheck.helper'
import * as TranslateHelper from './translate.helper'
import { EnvConfig, AppConfig } from '~/configs'
import { HttpStatusCode } from '~/shared/enums'
import { BaseResponse } from '~/shared/types'
import { AuthAPI } from '~/features/auth/apis'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = LocalStorageHelper.getAccessToken()
    this.refreshToken = LocalStorageHelper.getRefreshToken()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: AppConfig.PLCBaseApi,
      timeout: EnvConfig.HttpTimeout,
      headers: {
        'Content-Type': 'application/json'
      },
      paramsSerializer: (params) => queryString.stringify(params)
    })

    this.instance.interceptors.request.use(
      (config) => {
        this.setAuthorizationHeader(config)

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: AxiosError) => {
        this.showErrorMessage(error)
        this.handleUnauthorizedResponse(error)

        return Promise.reject(error)
      }
    )
  }

  private setAuthorizationHeader(config: InternalAxiosRequestConfig<any>) {
    if (this.accessToken && config.headers) {
      config.headers.authorization = `Bearer ${this.accessToken}`
    }
  }

  private showErrorMessage(error: AxiosError) {
    const untoastedCode = [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden, HttpStatusCode.UnprocessableEntity]
    const errorCode = error.response?.status as number

    if (!untoastedCode.includes(errorCode)) {
      const data: BaseResponse<null> = error.response?.data as BaseResponse<null>
      toast.error(TranslateHelper.translate(data?.message))
    }
  }

  private handleUnauthorizedResponse(error: AxiosError) {
    if (TypeCheckHelper.isAxiosUnauthorizedError<BaseResponse<null>>(error)) {
      const config: AxiosRequestConfig<any> = error.response?.config || {}
      const { url } = config
      if (url !== 'auth/refresh-token') {
        this.refreshTokenRequest = this.refreshTokenRequest
          ? this.refreshTokenRequest
          : this.handleRefreshToken().finally(() => {
              // Keep refresh token request for other concurrent request
              setTimeout(() => {
                this.refreshTokenRequest = null
              }, 10000)
            })
        // Recall error request
        return this.refreshTokenRequest.then((accessToken) => {
          return this.instance({
            ...config,
            headers: { ...config.headers, authorization: accessToken }
          })
        })
      }
      LocalStorageHelper.clear()
      this.accessToken = ''
      this.refreshToken = ''
    }
  }

  private async handleRefreshToken() {
    try {
      const res = await AuthAPI.refreshToken({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken
      })
      const { accessToken } = res.data.data
      LocalStorageHelper.setAccessToken(accessToken)
      this.accessToken = accessToken
      return accessToken
    } catch (error) {
      LocalStorageHelper.clear()
      this.accessToken = ''
      this.refreshToken = ''
      throw error
    }
  }
}

export default new Http().instance
