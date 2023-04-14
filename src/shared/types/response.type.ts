export interface BaseResponse<T> {
  data: T
  statusCode: number
  message: string
  errors: { [key: string]: string[] }
}

export type PagedRespone<T> = BaseResponse<{ totalRecords: number; records: T[] }>
