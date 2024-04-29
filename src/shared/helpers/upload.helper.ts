/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3PresignedUrlRequest } from '~/features/media/models'
import { MediaApi } from '~/features/media/apis'

export async function upload(file: File | undefined, prefix?: string) {
  return await uploadByPresignedUrl(file, prefix)
}

async function uploadByServer(file: File | undefined, prefix?: string) {
  const uploadResponse = await MediaApi.uploadFile(file, prefix)
  return uploadResponse?.data.data
}

async function uploadByPresignedUrl(file: File | undefined, prefix?: string) {
  const presignedUrlRequest: S3PresignedUrlRequest = {
    filePath: prefix ? prefix.trim() + '/' + file?.name : file?.name,
    contentType: file?.type
  }

  const presignedUrlResponse = (await MediaApi.getPresignedUploadUrl(presignedUrlRequest))?.data.data
  if (!presignedUrlResponse || !presignedUrlResponse.presignedUrl || !presignedUrlResponse.objectKey) return

  await MediaApi.uploadFileByPresignedUrl(file, presignedUrlResponse.presignedUrl)
  return presignedUrlResponse.objectKey
}
