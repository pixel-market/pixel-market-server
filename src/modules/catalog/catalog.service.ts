import { Injectable } from '@nestjs/common'

import { PrismaService } from 'modules/prisma/prisma.service'

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany({
      where: { parentCategoryId: null },
      include: {
        products: true,
        subcategories: { include: { products: true } },
      },
    })
  }
}
