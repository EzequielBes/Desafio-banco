import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Interceptor } from "./interceptor";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const interceptor = app.get(Interceptor)
  app.useGlobalInterceptors(interceptor);
    
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
  .setTitle('API BANCO')
  .setDescription('')
  .addBearerAuth()
  .setVersion('0.0.1')
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
