import { ApiProperty } from '@nestjs/swagger'

import { T_CategoryId } from 'models/app'

class VariantDto {
  @ApiProperty()
  id?: number

  @ApiProperty()
  name: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  price: string

  @ApiProperty()
  description: string
}

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

  @ApiProperty({ required: false, type: [VariantDto] })
  variants: VariantDto[]
}
