import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Controller } from 'react-hook-form'

import { MediaApi } from '~/features/media/apis'

interface Prop {
  control?: any
  controlField?: string
  defaultValue?: string
}

export default function RichTextInput(props: Prop) {
  const { control, controlField, defaultValue } = props

  const uploadAdapter = (loader: any) => {
    return {
      upload: () => {
        return loader.file.then(async (file: File) => {
          try {
            const imageUploadResponse = await MediaApi.uploadFile(file)
            const imageUrl = imageUploadResponse?.data.data || ''
            return {
              default: imageUrl
            }
          } catch (err) {
            console.log(err)
          }
        })
      }
    }
  }

  const uploadPlugin = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader)
    }
  }

  if (!control || !controlField) return null

  return (
    <Controller
      name={controlField}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange } }) => (
        <CKEditor
          editor={ClassicEditor}
          data={defaultValue}
          onChange={(_, editor) => {
            onChange(editor.getData())
          }}
          config={{
            extraPlugins: [uploadPlugin]
          }}
        />
      )}
    />
  )
}
