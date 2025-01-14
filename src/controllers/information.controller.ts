import { Controller, Get, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { initShuttleInfor, ShuttleResponseDto } from 'src/dtos';
import { Node, PointDto, ShuttleRoute } from 'src/dtos/find-route';
import { PublishTopic, SubscribeTopic } from 'src/enums';
import { SHUTTLE_CODE } from 'src/env';
import { ShuttleInformation } from 'src/global-static';
import { MqttService, SharedService } from 'src/services';

@Controller('information')
export class InformationController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    // MqttService
    @Inject('MqttServiceInterface')
    private readonly mqttService: MqttService,
  ) {}

  @EventPattern(`${SubscribeTopic.SHUTTLE_INFORMATION_TOPIC}${SHUTTLE_CODE}`)
  async handleShuttleInformation(
    @Payload() shuttleResponseDto: ShuttleResponseDto,
  ) {
    try {
      // console.log(shuttleResponseDto);

      ShuttleInformation.INFORMATION = shuttleResponseDto;
    } catch (error) {
      console.log('Lỗi dữ liệu gửi lên từ shuttle');
    }
  }

  @EventPattern(
    `${SubscribeTopic.ROUTE_PROGRAM_COMPLETE_MISSION_TOPIC}${SHUTTLE_CODE}`,
  )
  async handleFindRouteComplete(@Payload() payload: any) {
    try {
      // console.log(shuttleResponseDto);

      console.log(payload);
    } catch (error) {
      console.log('Lỗi dữ liệu gửi lên từ shuttle');
    }
  }

  @Get('')
  async getShuttleInfor() {
    return ShuttleInformation.INFORMATION;
  }

  @MessagePattern({ cmd: 'get-shortest-path-of-shuttle' })
  async getShortestPath(
    @Ctx() context: RmqContext,
    @Payload()
    payload: any,
  ) {
    this.sharedService.acknowledgeMessage(context);
    const result = await ShuttleRoute.findMinRoute(
      payload.positions,
      payload.startNode,
      payload.endNode,
      payload.otherNodes,
      payload.maxOx,
      payload.maxOy,
      payload.isImportRole,
      payload.isExportRole,
      payload.isHasItem,
      payload.isFindFasterRoute || false,
      payload.isNotCheckQrCode || false,
    );
    const listPoint: PointDto[] = result.map((item: any) => {
      return {
        id: item.id,
        x: item.x,
        y: item.y,
        qrCodes: item.qrCodes,
      } as PointDto;
    });

    return ShuttleRoute.getMoveRoute(listPoint);
  }
}
