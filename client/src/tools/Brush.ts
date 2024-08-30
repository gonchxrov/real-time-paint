import { ITool } from "../interfaces";
import { Socket } from "./Socket";
import { Tool } from "./Tool";

export class Brush extends Tool implements ITool {
  protected mouseDown: boolean = false

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true

    if (this.id) {
      Socket.sendDrawMessage(this.socket, this.id, 'finish')
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown && this.id) {
      const target = e.target as HTMLElement;

      Socket.sendDrawMessage(this.socket, this.id, 'brush', {
        x: e.pageX - target.offsetLeft,
        y: e.pageY - target.offsetTop,
        lineWidth: this.ctx?.lineWidth,
        colorStroke: this.ctx?.strokeStyle
      })
    }
  }

  draw(x: number, y: number, lineWidth: number, colorStroke: string) {
    if (this.ctx) {
      const strokeStyleOld = this.ctx.strokeStyle;
      const lineWidthOld = this.ctx.lineWidth
  
      this.ctx.strokeStyle = colorStroke;
      this.ctx.lineWidth = lineWidth
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
  
      this.ctx.strokeStyle = strokeStyleOld;
      this.ctx.lineWidth = lineWidthOld
    }
  }

  static draw(ctx: CanvasRenderingContext2D, x: number, y: number, lineWidth: number, colorStroke: string) {
    const strokeStyleOld = ctx.strokeStyle;
    const lineWidthOld = ctx.lineWidth

    ctx.strokeStyle = colorStroke;
    ctx.lineWidth = lineWidth
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.strokeStyle = strokeStyleOld;
    ctx.lineWidth = lineWidthOld
  }
}