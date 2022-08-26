import { E_ProductType } from '@prisma/client'

export interface I_Variant {
  id: number
  name: string
  amount: number
  price: string
  parentProductId: number
  description: string
  type: E_ProductType
}
