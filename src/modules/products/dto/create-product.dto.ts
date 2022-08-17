import { ApiProperty } from '@nestjs/swagger'

import { T_CategoryId } from 'models/app'

export class CreateProductDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  price: string

  @ApiProperty()
  categoryId: T_CategoryId
}
