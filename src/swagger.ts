import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerDocumentconfig = new DocumentBuilder()
  .setTitle('Meeting')
  .setDescription('The Meeting API description')
  .setVersion('0.0.1')
  .addTag('meeting')
  .build();
