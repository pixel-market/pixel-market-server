import { ApiProperty, PartialType } from '@nestjs/swagger'
import { I_VariantForUpdate } from 'models/product'

import { CreateProductDto } from './create-product.dto'

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false })
  variants: I_VariantForUpdate[]
}
