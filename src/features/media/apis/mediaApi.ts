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
    return HttpHelper.put(presignedUrl, file)
  }
}

export default mediaApi
