import { AxiosError } from 'axios'

import * as TranslateHelper from './translate.helper'
import { HttpStatusCode } from '~/shared/enums'
import { BaseResponse } from '~/shared/types'

export function getErrorFromServer(error: AxiosError) {
  const errorCode = error.response?.status as number
  const errorData: BaseResponse<null> = error.response?.data as BaseResponse<null>
  const validateErrors: { [key: string]: { message: string; type: string } } = {}

  if (errorCode === HttpStatusCode.UnprocessableEntity) {
    Object.keys(errorData.errors).forEach((key) => {
      const errorContents = errorData.errors[key].map((error) => TranslateHelper.translate(error)).join('<br/>')

      validateErrors[key] = {
        message: errorContents,
        type: 'Server'
      }
    })
  }
  return validateErrors
}
