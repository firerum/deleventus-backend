import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // versioning the API using nestjs
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // accept cross origin
  app.enableCors({
    origin: [
      'https://deleventus-frontend.vercel.app',
      'https://deleventus-frontend.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // helmet for proper headers
  app.use(helmet());

  // this is to use class validators on my DTOs and remove unwanted properties that may be passed
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // swagger setup
  const options = new DocumentBuilder()
    .setTitle('Deleventus API')
    .setDescription('Deleventus App API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Port to listen to
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
