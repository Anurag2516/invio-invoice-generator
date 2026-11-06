import { getCurrencySign } from '@/utils/currency'

export const useCurrencySign = (currency?: string) => {
  return getCurrencySign(currency);
};
