export interface BaseResponse<T> {
  data: T
  statusCode: number
  message: string
  errors: { [key: string]: string[] }
}

export type PagedResponse<T> = BaseResponse<{ totalRecords: number; records: T[] }>
