export interface ITool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  strokeColor: string;
  fillColor: string;
  lineWidth: number;
  listen(): void;
  destroyEvents(): void;
  mouseUpHandler(e: MouseEvent): void;
  mouseDownHandler(e: MouseEvent): void;
  mouseMoveHandler(e: MouseEvent): void;
  draw(...args: any): void;
}