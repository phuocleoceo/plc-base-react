import 'ckeditor5/ckeditor5.css'

import {
  Autoformat,
  BlockQuote,
  Bold,
  CKBox,
  CKFinder,
  CKFinderUploadAdapter,
  ClassicEditor,
  CloudServices,
  EasyImage,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  Table,
  TableToolbar,
  TextTransformation
} from 'ckeditor5'
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
            // Keep the plugins and toolbar from the former Classic predefined build.
            plugins: [
              Autoformat,
              BlockQuote,
              Bold,
              CKBox,
              CKFinder,
              CKFinderUploadAdapter,
              CloudServices,
              EasyImage,
              Essentials,
              Heading,
              Image,
              ImageCaption,
              ImageStyle,
              ImageToolbar,
              ImageUpload,
              Indent,
              Italic,
              Link,
              List,
              MediaEmbed,
              Paragraph,
              PasteFromOffice,
              PictureEditing,
              Table,
              TableToolbar,
              TextTransformation
            ],
            toolbar: {
              items: [
                'undo',
                'redo',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'link',
                'uploadImage',
                'insertTable',
                'blockQuote',
                'mediaEmbed',
                '|',
                'bulletedList',
                'numberedList',
                'outdent',
                'indent'
              ]
            },
            image: {
              toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative'
              ]
            },
            table: {
              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
            },
            language: 'en',
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
