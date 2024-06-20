import axios from 'axios'

import { FileUploadResponse, S3PresignedUrlRequest, S3PresignedUrlResponse } from '~/features/media/models'
import { HttpHelper } from '~/shared/helpers'

const mediaApi = {
  uploadFile(file: File | undefined, prefix?: string) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    return HttpHelper.post<FileUploadResponse>('upload-file', formData, {
      params: { prefix },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getPresignedUploadUrl(request: S3PresignedUrlRequest) {
    if (!request || !request.fileName || !request.contentType) return

    return HttpHelper.post<S3PresignedUrlResponse>('presigned-upload-url', request)
  },
  uploadFileByPresignedUrl(file: File | undefined, presignedUrl: string) {
    if (!file || !presignedUrl) return

    // HttpHelper use Bearer token in Authorization Header override AWS Authorization
    return axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type
      }
    })
  }
}

export default mediaApi
