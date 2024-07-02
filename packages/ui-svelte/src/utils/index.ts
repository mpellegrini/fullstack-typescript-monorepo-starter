import { type ClassValue as ClsxClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type ClassValue = string | null | undefined

export const cn = (...inputs: ClsxClassValue[]): string => {
  return twMerge(clsx(inputs))
}
