import { MediaApi } from '~/features/media/apis'

export default function useFileUpload() {
  const uploadByServer = async (file: File | undefined, prefix?: string) => {
    const uploadResponse = await MediaApi.uploadFile(file, prefix)
    return uploadResponse?.data.data
  }

  const uploadByPresignedUrl = (file: File | undefined, prefix?: string) => {}

  return {
    uploadByServer,
    uploadByPresignedUrl
  }
}
