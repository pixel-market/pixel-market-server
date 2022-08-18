import { Injectable } from '@nestjs/common'
import { PrismaService } from 'modules/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        image:
          'https://preview.redd.it/wzxp33nr62921.png?auto=webp&s=7b197c06cd782edaf79ee4b49ae80129692df81d',
        categories: { connect: { id: createProductDto.categoryId } },
      },
    })
  }

  async findAll() {
    return await this.prisma.product.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.product.findFirst({
      where: { id },
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
      },
    })
  }

  async remove(id: number) {
    return await this.prisma.product.delete({ where: { id } })
  }
}
