import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('navigation')
export class NavigationController {
  constructor() {}

  @MessagePattern('khachuy')
  handleMQTTMessage(@Payload() message: any) {
    console.log('Received message:', message);
  }
}
