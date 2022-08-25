import { ApiProperty } from '@nestjs/swagger'
import { Product } from '@prisma/client'

import { T_CategoryId } from 'models/app'

export class CreateProductDto {
  @ApiProperty()
  name: string

  @ApiProperty({ required: false })
  description: string

  @ApiProperty({ required: false })
  price: string

  @ApiProperty()
  categoryId: T_CategoryId

  @ApiProperty({ required: false })
  amount: number

  @ApiProperty({ required: false })
  variants: { name: string; amount: number; price: string }[]
}
