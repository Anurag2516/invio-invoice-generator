import { currencyOptions } from "@/constants/currencies";

export const getCurrencySign = (currencyCode: string) => {
  return currencyOptions.find((c) => c.value === currencyCode)?.sign;
};
