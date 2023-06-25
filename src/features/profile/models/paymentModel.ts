import { BaseResponse } from '~/shared/types'

export type CreatePaymentRequest = {
  amount: number
}

export type CreatePaymentResponse = string

export type SubmitPaymentRequest = {
  vnp_Amount: number
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: number
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: number
  vnp_SecureHash: string
}

export type SubmitPaymentResponse = BaseResponse<boolean>
