import { ITool } from "../interfaces";
import { Brush } from "./Brush";
import { Socket } from "./Socket";

export class Eraser extends Brush implements ITool {
  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id)
    this.listen()
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const target = e.target as HTMLElement; 

      if (this.id) {
        Socket.sendDrawMessage(this.socket, this.id, 'eraser', {
          x: e.pageX - target.offsetLeft,
          y: e.pageY - target.offsetTop
        })
      }
    }
  }
  
  draw(x: number, y: number) {
    if (this.ctx) {
      const strokeStyleOld = this.ctx.strokeStyle;

      this.ctx.strokeStyle = 'white'
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      this.ctx.strokeStyle = strokeStyleOld;
    }
  }
  
  static draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const strokeStyleOld = ctx.strokeStyle;

    ctx.strokeStyle = 'white'
    ctx.lineTo(x, y)
    ctx.stroke()
    
    ctx.strokeStyle = strokeStyleOld;
  }
}