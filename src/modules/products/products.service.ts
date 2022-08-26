import { Injectable } from '@nestjs/common'
import { E_ProductType } from '@prisma/client'
import { I_Variant } from 'models/product'
import { PrismaService } from 'modules/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const isVariate = Boolean(createProductDto.variants.length)

    const productType = isVariate
      ? E_ProductType.VARIATIVE
      : E_ProductType.SINGLE

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        amount: createProductDto.amount,
        type: productType,
        image:
          'https://preview.redd.it/wzxp33nr62921.png?auto=webp&s=7b197c06cd782edaf79ee4b49ae80129692df81d',
        categories: { connect: { id: createProductDto.categoryId } },
      },
    })

    if (!isVariate) return

    // Добавляем вариации
    const variants: Omit<I_Variant, 'id'>[] = createProductDto.variants.map(
      (variant) => ({
        name: variant.name,
        amount: variant.amount,
        price: variant.price,
        description: variant.description,
        parentProductId: product.id,
        type: E_ProductType.VARIANT,
      }),
    )
    await this.prisma.product.createMany({
      data: variants,
    })

    // Задаём минимальную цену и количество товаров относительно вариаций
    const { minPrice, totalAmount } = this.getVariativeProductPrice(
      createProductDto.variants,
    )

    await this.prisma.product.update({
      where: { id: product.id },
      data: {
        amount: totalAmount,
        price: String(minPrice),
      },
    })
  }

  async findAll() {
    return await this.prisma.product.findMany({
      where: { parentProductId: null },
    })
  }

  async findOne(id: number) {
    return await this.prisma.product.findFirst({
      where: { id },
      include: { variants: true },
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const isVariate = Boolean(updateProductDto.variants.length)

    const productType = isVariate
      ? E_ProductType.VARIATIVE
      : E_ProductType.SINGLE

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        amount: updateProductDto.amount,
        type: productType,
      },
      include: { variants: true },
    })

    if (!isVariate) return

    // Удаляем вариации, если они не пришли с фронта
    // Достаём id несуществующих вариаций
    const deleteVariants: number[] = product.variants
      .filter((productVariant) => {
        const index = updateProductDto.variants.findIndex(
          (variant) => variant.id === productVariant.id,
        )
        if (index === -1) return true
        return false
      })
      .map((variant) => variant.id)

    if (deleteVariants.length) {
      await this.prisma.product.deleteMany({
        where: { id: { in: deleteVariants } },
      })
    }

    // Создаём новые вариации
    const createVariants: Omit<I_Variant, 'id'>[] = updateProductDto.variants
      .filter((variant) => !variant.id)
      .map((variant) => ({
        name: variant.name,
        amount: variant.amount,
        price: variant.price,
        description: variant.description,
        parentProductId: id,
        type: E_ProductType.VARIANT,
      }))

    if (createVariants.length) {
      await this.prisma.product.createMany({
        data: createVariants,
      })
    }

    // Обновляем имеющиеся вариации
    const updateVariants: any[] = updateProductDto.variants
      .filter((variant) => variant.id)
      .map((variant) => ({
        data: {
          name: variant.name,
          amount: variant.amount,
          price: variant.price,
          description: variant.description,
        },
        where: { id: variant.id },
      }))
    if (updateVariants.length) {
      await this.prisma.product.update({
        where: { id },
        data: {
          variants: { update: updateVariants },
        },
      })
    }

    // Задаём минимальную цену и количество товаров относительно вариаций
    const { minPrice, totalAmount } = this.getVariativeProductPrice(
      updateProductDto.variants,
    )

    await this.prisma.product.update({
      where: { id },
      data: {
        amount: totalAmount,
        price: String(minPrice),
      },
    })
  }

  async remove(id: number) {
    return await this.prisma.product.delete({ where: { id } })
  }

  getVariativeProductPrice(variants: any): {
    minPrice: string
    totalAmount: number
  } {
    const { minPrice, totalAmount } = variants.reduce(
      (acc, variant) => {
        return {
          minPrice:
            Number(acc.minPrice) < Number(variant.price)
              ? acc.minPrice
              : variant.price,
          totalAmount: variant.amount + acc.totalAmount,
        }
      },
      { minPrice: Infinity, totalAmount: 0 },
    )

    return {
      minPrice: minPrice,
      totalAmount,
    }
  }
}
