import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { TranslateHelper, UploadHelper } from '~/shared/helpers'

interface Prop {
  control?: any
  controlField?: string
  defaultValue?: string
}

export default function RichTextInput(props: Prop) {
  const { control, controlField, defaultValue } = props

  function uploadAdapter(loader: any) {
    return {
      upload: () => {
        return loader.file.then(async (file: File) => {
          try {
            return {
              default: (await UploadHelper.upload(file)) || ''
            }
          } catch {
            toast.error(TranslateHelper.translate('upload_file_fail'))
          }
        })
      }
    }
  }

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader)
    }
  }

  if (!control || !controlField) return <></>

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
            extraPlugins: [uploadPlugin],
            mediaEmbed: {
              previewsInData: true
            }
          }}
        />
      )}
    />
  )
}
