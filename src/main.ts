import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { initAdapters } from './adapters.init';
// import { swaggerDocumentconfig } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const swaggerDocumentconfig = new DocumentBuilder()
    .setTitle('Meeting')
    .setDescription('The Meeting API, enjoy dudes!')
    .setVersion('0.0.1')
    .addTag('users')
    .addTag('rooms')
    .addTag('messages')
    .addTag('geolocations')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocumentconfig);
  // TODO разобраться почему не меняется url
  SwaggerModule.setup('api', app, document);

  initAdapters(app);

  await app.listen(3000);
}
bootstrap();
