import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://127.0.0.1:5173',
      credentials: true,
    },
  })

  const config = new DocumentBuilder()
    .setTitle('Pixel Market')
    .setDescription('The Pixel Market API description')
    .setVersion('1.0')
    .addTag('categories')
    .addTag('products')
    .addTag('auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000)
}
bootstrap()
