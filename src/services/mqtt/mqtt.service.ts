import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttOptions, Transport } from '@nestjs/microservices';
import { MqttClient } from 'mqtt/*';
import { MqttServiceInterface } from 'src/interfaces';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements MqttServiceInterface {
  private mqttClient: MqttClient;
  constructor(private readonly configService: ConfigService) {
    const HOST = this.configService.get('MQTT_HOST');
    const MQTT_PORT = this.configService.get('MQTT_PORT');
    this.mqttClient = mqtt.connect(`mqtt:${HOST}:${MQTT_PORT}`,{
      
    });
  }

  publishDataToShuttle(topic: string, data: any) {
    this.mqttClient.publish(topic, data);
  }

  getMqttOptions(): MqttOptions {
    const USER = this.configService.get('MQTT_USER');
    const PASSWORD = this.configService.get('MQTT_PASS');
    const HOST = this.configService.get('MQTT_HOST');
    const MQTT_PORT = this.configService.get('MQTT_PORT');
    const reconnectPeriod = this.configService.get('MQTT_RECONNECTPERIOD');
    const connectTimeout = this.configService.get('MQTT_CONNECTTIMEOUT');

    return {
      transport: Transport.MQTT,
      options: {
        host: HOST,
        port: MQTT_PORT,
        username: USER,
        password: PASSWORD,
        reconnectPeriod,
        connectTimeout,
      },
    };
  }
}
