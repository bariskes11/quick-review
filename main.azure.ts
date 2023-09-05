require('dotenv').config();
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as appPackage from 'package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';
import { createWriteStream, writeFileSync } from 'fs';
import { get } from 'http';
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.set('trust proxy');
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
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
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      useGlobalPrefix: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method'

    }
  });
  

//writeFileSync("./swagger.json", JSON.stringify(document));
SwaggerModule.setup ('swagger-doc', app, document);
  const serverUrl = 'http://mainserver/url'; // Define the route
  app.use(serverUrl, swaggerUi.serve, swaggerUi.setup(document));
  // I also tried to copy files but it' didn't work
  // write swagger ui files
  // get(
  //   `${serverUrl}/swagger/swagger-ui-bundle.js`, function
  //   (response) {
  //   response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
  //   console.log(
  //     `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
  //   );
  // }); 

  // get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
  //   response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
  //   console.log(
  //     `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
  //   );
  // });

  // get(
  //   `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
  //   function (response) {
  //     response.pipe(
  //       createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
  //     );
  //     console.log(
  //       `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
  //     );
  //   });

  // get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
  //   response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
  //   console.log(
  //     `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
  //   );
  // });
 
  app.init();
console.log("main is called!");
   app.listen(3000);
  return app;
}
