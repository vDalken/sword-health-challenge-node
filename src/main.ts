import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    validateCustomDecorators: true,
  }));

  // microservice http requests
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: Number(process.env.PORT + 1),
    },
  });

  // microservice queue - notification
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.TRANSPORT_URL)],
      queue: String(process.env.TRANSPORT_QUEUE),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
