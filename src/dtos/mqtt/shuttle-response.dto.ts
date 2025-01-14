export class ShuttleResponseDto {
  no: string; // mã shuttle
  ip: string; // địa chỉ ip shuttle
  shuttleMode: number; // auto/manual
  chargeCycle: number; // chu kỳ sạc
  batteryCapacity: number; // dung lượng pin Ah
  batteryPercentage: number; // phần trăm pin
  chargeDischargeStatus: number; // Trạng thái đang sạc hay không
  shuttleStatus: number; // 0/stop, 1/run, 2/error /
  status: number;
  power: number; // Công suất
  powerConsumption: number; // công suất tiêu thụ W
  errorCode: number; // mã lỗi 0/ko lỗi
  speed: number; // tốc độ
  commandComplete: number; // 0/ chưa hoàn 1/ hoàn thành
  qrCode: string; // mã QR
  packageStatus: number; // 0/ không có mang hàng, 1/ có mang hàng
  missionCompleted: number; // tổng nhiệm vụ đã hoàn thành
  temperature: number; // nhiệt độ shuttle
  pressure: number; // áp suất dầu thủy lực
  ox: number;
  oy: number;
  floor: number;
}

export const initShuttleInfor: ShuttleResponseDto = {
  no: 'string', // mã shuttle
  ip: 'string', // địa chỉ ip shuttle
  shuttleMode: -1, // auto/manual
  chargeCycle: -1, // chu kỳ sạc
  batteryCapacity: -1, // dung lượng pin Ah
  batteryPercentage: -1, // phần trăm pin
  chargeDischargeStatus: -1, // Trạng thái đang sạc hay không
  shuttleStatus: -1, // 0/stop, 1/run, 2/error /
  status: -1,
  power: -1, // Công suất
  powerConsumption: -1, // công suất tiêu thụ W
  errorCode: -1, // mã lỗi 0/ko lỗi
  speed: -1, // tốc độ
  commandComplete: -1, // 0/ chưa hoàn 1/ hoàn thành
  qrCode: 'string', // mã QR
  packageStatus: -1, // 0/ không có mang hàng, 1/ có mang hàng
  missionCompleted: -1, // tổng nhiệm vụ đã hoàn thành
  temperature: -1, // nhiệt độ shuttle
  pressure: -1, // áp suất dầu thủy lực
  ox: -1,
  oy: -1,
  floor: -1,
};
