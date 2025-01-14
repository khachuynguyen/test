import { initShuttleInfor, ShuttleResponseDto } from 'src/dtos';
import { SHUTTLE_CODE } from 'src/env';

export class ShuttleInformation {
  public static SHUTTLE_CODE: string = SHUTTLE_CODE;
  public static INFORMATION: ShuttleResponseDto = initShuttleInfor;
}
