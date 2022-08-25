export interface I_Variant {
  name: string
  amount: number
  price: string
  parentProductId: number
}

export interface I_VariantForUpdate extends I_Variant {
  id: number
}
