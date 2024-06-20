import { BaseResponse } from '~/shared/types'

export type FileUploadResponse = BaseResponse<string>

export type S3PresignedUrlRequest = {
  prefix?: string
  fileName?: string
  contentType?: string
}

export type S3PresignedUrlResponse = BaseResponse<{
  presignedUrl: string
  objectKey: string
}>
