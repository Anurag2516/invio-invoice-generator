import { useInvoiceStore } from '@/store/invoiceStore'
import { getCurrencySign } from '@/utils/currency'

export const useCurrencySign = () => {
  const currency = useInvoiceStore((state) => state.activeInvoice.currency)

  return getCurrencySign(currency)
}
