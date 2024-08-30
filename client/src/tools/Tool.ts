import { ITool } from "../interfaces";

export abstract class Tool implements ITool {
  public socket: WebSocket;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D | null = null;
  public id: string | null = '';

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    this.id = id;
    this.socket = socket;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.destroyEvents()
    this.listen()
  }

  set fillColor(color: string) {
    if (this.ctx) {
      this.ctx.fillStyle = color
    }
  }

  set strokeColor(color: string) {
    if (this.ctx) {
      this.ctx.strokeStyle = color
    }
  }

  set lineWidth(width: number) {
    if (this.ctx) {
      this.ctx.lineWidth = width
    }
  }

  public listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  public destroyEvents() {
    this.canvas.onmousemove = null
    this.canvas.onmousedown = null
    this.canvas.onmouseup = null
  }

  abstract mouseUpHandler(e: MouseEvent): void

  abstract mouseDownHandler(e: MouseEvent): void

  abstract mouseMoveHandler(e: MouseEvent): void

  abstract draw(...args: any): void

  public static clearAll(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0,0, width, height)
  }

  public static finish(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
  }

  public static print(ctx: CanvasRenderingContext2D, width: number, height: number, imgUrl: string) {
    const img = new Image()
    img.src = imgUrl;
    img.onload = () => {
      ctx.clearRect(0,0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
    }
  }
}