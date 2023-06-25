import { CreatePaymentRequest, CreatePaymentResponse } from '~/features/profile/models'
import { HttpHelper } from '~/shared/helpers'

const paymentApi = {
  createPayment(body: CreatePaymentRequest) {
    return HttpHelper.post<CreatePaymentResponse>('user/payment', body)
  }
}

export default paymentApi
