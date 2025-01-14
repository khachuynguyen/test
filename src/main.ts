import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MqttService, SharedService } from './services';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT_API || 3005;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const mqttService = app.get(MqttService);
  const config = new DocumentBuilder()
    .setTitle('Control Shuttle Api')
    .setDescription('The shuttles API description')
    .setVersion('1.0')
    .addTag('shuttles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: '*', // Adjust this according to your frontend URL, e.g., 'http://localhost:3000'
    exposedHeaders: ['Content-Disposition'], // Expose 'Content-Disposition' header
  });
  const queue =
    configService.get('RABBITMQ_CONTROL_SHUTTLE_APP_QUEUE') ||
    'shuttle_ctdk_queue_vlocal';
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.connectMicroservice(mqttService.getMqttOptions());
  app.init();
  await app.startAllMicroservices();
  app.listen(PORT);
}
bootstrap();
