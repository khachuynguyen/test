import { MqttOptions } from '@nestjs/microservices';

export interface MqttServiceInterface {
  getMqttOptions(queue: string): MqttOptions;
}
