import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
        origin: "http://localhost:4200",
        credentials: true,
    });
  const PORT = process.env.PORT ?? 8000;
  await app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log("ENV KEY:", process.env.ENCRYPTION_KEY);
  });
}
bootstrap();
