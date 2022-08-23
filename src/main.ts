import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  })

  const config = new DocumentBuilder()
    .setTitle('Pixel Market')
    .setDescription('The Pixel Market API description')
    .setVersion('1.0')
    .addTag('categories')
    .addTag('catalog')
    .addTag('products')
    .addTag('auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000)
}
bootstrap()
