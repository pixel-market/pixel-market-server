import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        parentCategoryId: createCategoryDto.parentCategoryId,
      },
    })
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: {
        products: true,
      },
    })
  }

  async findOne(id: number) {
    return await this.prisma.category.findFirst({
      where: { id },
      include: { products: true },
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
    })
  }

  async remove(id: number) {
    return await this.prisma.category.delete({ where: { id } })
  }
}
