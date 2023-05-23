import { FileUploadResponse } from '~/features/media/models'
import { HttpHelper } from '~/shared/helpers'

const mediaApi = {
  uploadFile(file: File, prefix?: string) {
    const formData = new FormData()
    formData.append('file', file)

    return HttpHelper.post<FileUploadResponse>('upload-file', formData, {
      params: { prefix },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default mediaApi
