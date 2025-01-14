import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Controllers from './controllers';
import * as Services from './services';
import { SharedModule } from './shared.module';

const injectServices = Object.values(Services).map((service) => {
  return {
    provide: `${service.name}Interface`,
    useClass: service,
  };
});
const controllers = Object.values(Controllers).map((controller) => {
  return controller;
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule.registerRmq('APP_SHUTTLE',process.env.RABBITMQ_CONTROL_SHUTTLE_APP_QUEUE)
  ],
  controllers: [...controllers],
  providers: [...injectServices, Services.SharedService, Services.MqttService],
})
export class AppModule {}
