import { RobotDirection } from 'src/enums/robot-move.enum';

export class Node {
  x: number;
  y: number;
  g: number = 0;
  h: number = 0;
  f: number = 0;
  neighbors: Node[] = [];
  previous: Node | null = null;
  isHasItem: boolean = false;
  isScanError: boolean = false;
  time: number = 0;
  positionType: string = '';
  qrCodes: string[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getDetail(): string {
    let detail = `x = ${this.x} \t y = ${this.y} \t g = ${this.g} \t f = ${this.f} \t h = ${this.h} \t isHasItem = ${this.isHasItem} \t positionType = ${this.positionType} \t`;
    if (this.neighbors.length > 0) {
      detail += ' neighbors = [ ';
      this.neighbors.forEach((n) => {
        detail += ` [ ${n.x} , ${n.y} ]`;
      });
      detail += ' ]\t ';
    }
    if (this.previous) {
      detail += ` previous = [ ${this.previous.x} , ${this.previous.y} ] \t`;
    }
    return detail;
  }
}

export class PointDto {
  x: number;
  y: number;
  qrCodes: string[];
}
export class PointWithDirectionDto extends PointDto {
  direction: RobotDirection;
  deceleration?: number;
}
