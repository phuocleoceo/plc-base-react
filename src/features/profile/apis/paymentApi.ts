import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  SubmitPaymentRequest,
  SubmitPaymentResponse
} from '~/features/profile/models'
import { HttpHelper } from '~/shared/helpers'

const paymentApi = {
  createPayment(body: CreatePaymentRequest) {
    return HttpHelper.post<CreatePaymentResponse>('payment', body)
  },
  submitPayment(body: SubmitPaymentRequest) {
    return HttpHelper.put<SubmitPaymentResponse>('payment', body)
  }
}

export default paymentApi
