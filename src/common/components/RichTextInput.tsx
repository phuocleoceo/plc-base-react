import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Controller } from 'react-hook-form'

interface Prop {
  control?: any
  controlField?: string
  defaultValue?: string
}

export default function RichTextInput(props: Prop) {
  const { control, controlField, defaultValue } = props

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
        />
      )}
    />
  )
}
