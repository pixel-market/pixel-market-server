import { Injectable } from '@nestjs/common'
import { I_Variant } from 'models/product'
import { PrismaService } from 'modules/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    console.log('createProductDto', createProductDto)
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        amount: createProductDto.amount,
        image:
          'https://preview.redd.it/wzxp33nr62921.png?auto=webp&s=7b197c06cd782edaf79ee4b49ae80129692df81d',
        categories: { connect: { id: createProductDto.categoryId } },
      },
    })

    const isVariate = Boolean(createProductDto.variants.length)

    if (!isVariate) return

    const variants: I_Variant[] = createProductDto.variants.map((variant) => ({
      name: variant.name,
      amount: variant.amount,
      price: variant.price,
      parentProductId: product.id,
    }))

    await this.prisma.product.createMany({
      data: variants,
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
    const updateVariants: any[] = updateProductDto.variants
      .filter((variant) => variant.id)
      .map((variant) => ({
        data: {
          name: variant.name,
          amount: variant.amount,
          price: variant.price,
        },
        where: { id: variant.id },
      }))

    await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        amount: updateProductDto.amount,
        variants: {
          update: updateVariants,
        },
      },
    })

    const isVariate = Boolean(updateProductDto.variants.length)

    if (!isVariate) return

    const newVariants: I_Variant[] = updateProductDto.variants
      .filter((variant) => !variant.id)
      .map((variant) => ({
        name: variant.name,
        amount: variant.amount,
        price: variant.price,
        parentProductId: id,
      }))

    if (newVariants.length) {
      await this.prisma.product.createMany({
        data: newVariants,
      })
    }

    // if (updateIdVariants.length) {
    //   await this.prisma.product.updateMany({
    //     where: { id: { in: updateIdVariants } },
    //     data: [],
    //   })
    // }
  }

  async remove(id: number) {
    return await this.prisma.product.delete({ where: { id } })
  }
}
