require('dotenv').config();
// import { AppConfigService } from './config/app/config.service';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';
import { join, resolve } from "path";
import { NestExpressApplication } from '@nestjs/platform-express';
import { get } from 'http';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as appPackage from 'package.json';
import * as swaggerUi from 'swagger-ui-express';

import { createWriteStream, writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.set('trust proxy');
  //   // app.use(json({ limit: '50mb' }));
  //   // app.use(urlencoded({ extended: true, limit: '50mb' }));
  const options = new DocumentBuilder()
    .setTitle('api-title')
    .setDescription('api description')
    .setVersion(appPackage.version)
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT Token",
      in: "header"
    }, "JWT-auth")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-local-doc', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method'
    }
  });
  await app.init();
  console.log("main is called!");
  await app.listen(3000);
}
bootstrap();



