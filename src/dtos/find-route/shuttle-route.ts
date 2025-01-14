import {
  decelerationFactors,
  decelerationSteps,
  RobotDirection,
} from 'src/enums/robot-move.enum';
import { Node, PointDto, PointWithDirectionDto } from './node-dto';

export class ShuttleRoute {
  static getMoveRoute(listPoint: PointDto[]): PointWithDirectionDto[] {
    const moveRouteWithDirection: PointWithDirectionDto[] = [];
    for (let index = 0; index < listPoint.length; index++) {
      const currentPoint: PointDto = listPoint[index];
      const nextPoint: PointDto =
        index + 1 >= listPoint.length ? null : listPoint[index + 1];
      const direction = this.getDirection(currentPoint, nextPoint);
      moveRouteWithDirection.push({ ...currentPoint, direction: direction });
    }
    const routeWithDeceleration: PointWithDirectionDto[] = this.addDeleceration(
      moveRouteWithDirection,
    );
    return routeWithDeceleration;
  }

  // hướng di chuyển
  static getDirection(currentPoint: PointDto, nextPoint: PointDto) {
    if (nextPoint == null) return RobotDirection.STOP;
    // không thể đi chéo
    const directionX = nextPoint.x - currentPoint.x;
    const directionY = nextPoint.y - currentPoint.y;
    if (directionX != 0 && directionY != 0) return null;
    // x khác nhau => y bằng nhau
    if (directionX != 0) {
      return directionX > 0 ? RobotDirection.BOTTOM : RobotDirection.TOP;
    }
    return directionY > 0 ? RobotDirection.RIGHT : RobotDirection.LEFT;
  }

  // thêm cờ giảm tốc
  static addDeleceration(steps: PointWithDirectionDto[]) {
    const result = [...steps]; // Tạo bản sao dữ liệu để không sửa đổi dữ liệu gốc.

    for (let i = 1; i < steps.length; i++) {
      // Nếu hướng đi thay đổi
      if (steps[i].direction !== steps[i - 1].direction) {
        // Đặt cờ giảm tốc cho các bước trước đó
        for (let j = 1; j <= decelerationSteps; j++) {
          const factorIndex = j - 1; // Lấy hệ số giảm tốc tương ứng
          if (i - j >= 0 && factorIndex < decelerationFactors.length) {
            result[i - j].deceleration = decelerationFactors[factorIndex];
          }
        }
      }
    }

    return result;
  }

  static findMinRoute(
    positions: Node[],
    startNode: Node,
    endNode: Node,
    otherNodes: number[][],
    maxOx: number,
    maxOy: number,
    isImportRole: boolean,
    isExportRole: boolean,
    isHasItem: boolean,
    isFindFasterRoute: boolean,
    isNotCheckQrCode: boolean,
  ): Node[] {
    if (startNode.x === endNode.x && startNode.y === endNode.y) {
      return [startNode];
    }
    let grid = this.createGrid(maxOx, maxOy);
    grid = this.syncGridFromMap(grid, positions);

    const closedSet: Node[] = [];
    const openSet: Node[] = [];
    const start = grid[startNode.x][startNode.y];
    const end = grid[endNode.x][endNode.y];

    openSet.push(start);

    while (openSet.length > 0) {
      let winnerIndex = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winnerIndex].f) {
          winnerIndex = i;
        }
      }

      const currentNode = openSet.splice(winnerIndex, 1)[0];
      closedSet.push(currentNode);

      for (const neighborNode of currentNode.neighbors) {
        const neighbor = grid[neighborNode.x][neighborNode.y];
        const tempG = this.calculateNode(currentNode, neighbor);

        if (
          (isNotCheckQrCode || neighbor.qrCodes.length > 0) &&
          !closedSet.includes(neighbor) &&
          !(isHasItem && neighbor.isHasItem) &&
          (isFindFasterRoute ||
            !this.checkCutNode(neighbor, otherNodes, startNode)) &&
          this.isNeighborLineWithRole(
            isImportRole,
            isExportRole,
            neighbor.positionType,
          )
        ) {
          if (end === neighbor) {
            neighbor.previous = currentNode;
            const path: Node[] = [];
            let temp: Node | null = neighbor;

            while (temp) {
              path.unshift(temp);
              if (temp.previous === start) break;
              temp = temp.previous;
            }
            if (path[0] !== start) {
              path.unshift(start);
            }
            return this.convertRouteWithLifter(path);
          }

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.h = this.heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = currentNode;
          }
        }
      }
    }

    return [];
  }

  static isNeighborLineWithRole(
    isImportRole: boolean,
    isExportRole: boolean,
    positionType: string,
  ): boolean {
    if (isImportRole && isExportRole) return true;
    if (isImportRole && positionType !== 'EXPORT_LINE') return true;
    if (isExportRole && positionType !== 'IMPORT_LINE') return true;
    return false;
  }

  static removeFromArray(nodeList: Node[], removeIndex: number): Node[] {
    nodeList.splice(removeIndex, 1);
    return nodeList;
  }

  static heuristic(a: Node, b: Node): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  static calculateNode(current: Node, neighbor: Node): number {
    if (
      !current.previous ||
      current.previous.x === neighbor.x ||
      current.previous.y === neighbor.y
    ) {
      return current.g + 500;
    }
    return current.g + 1500;
  }

  static checkCutNode(
    node: Node,
    otherNodes: number[][],
    startNode: Node,
  ): boolean {
    if (!this.isNeighborNode(startNode, node)) return false;
    return otherNodes.some((item) => item[0] === node.x && item[1] === node.y);
  }

  static isNeighborNode(node: Node, neighbor: Node): boolean {
    return (
      (node.x === neighbor.x && Math.abs(node.y - neighbor.y) === 1) ||
      (node.y === neighbor.y && Math.abs(node.x - neighbor.x) === 1)
    );
  }

  static createGrid(maxOx: number, maxOy: number): Node[][] {
    const grid: Node[][] = [];
    for (let i = 0; i < maxOx; i++) {
      const tempNodes: Node[] = [];
      for (let j = 0; j < maxOy; j++) {
        tempNodes.push(new Node(i, j));
      }
      grid.push(tempNodes);
    }
    return grid;
  }

  static syncGridFromMap(grid: Node[][], positions: Node[]): Node[][] {
    positions.forEach((node) => {
      grid[node.x][node.y] = node;
    });
    return grid;
  }

  static convertRouteWithLifter(route: Node[]): Node[] {
    const positions: Node[] = [];
    let count = 0;

    for (const node of route) {
      if (
        (node.positionType === 'IMPORT_LIFTER' ||
          node.positionType === 'EXPORT_LIFTER') &&
        count > 0
      ) {
        break;
      }
      positions.push(node);
      count++;
    }

    return positions;
  }
}
