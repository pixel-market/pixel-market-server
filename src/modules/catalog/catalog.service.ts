import { Injectable } from '@nestjs/common'

import { PrismaService } from 'modules/prisma/prisma.service'

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany({
      where: { parentCategoryId: null },
      orderBy: { subcategories: { _count: 'desc' } },
      include: {
        products: true,
        subcategories: { include: { products: true } },
      },
    })
  }
}
