import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initAdapters } from './adapters.init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initAdapters(app);

  await app.listen(3000);
}
bootstrap();
