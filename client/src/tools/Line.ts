import { ITool } from "../interfaces";
import { Socket } from "./Socket";
import { Tool } from "./Tool";

export class Line extends Tool implements ITool {
  private mouseDown: boolean = false
  private currentX: number = 0;
  private currentY: number = 0;
  private saved: string = '';

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false
    const target = e.target as HTMLElement; 

    if (this.id) {
      Socket.sendDrawMessage(this.socket, this.id, 'line', {
        x: e.pageX - target.offsetLeft,
        y: e.pageY - target.offsetTop,
        currentX: this.currentX,
        currentY: this.currentY,
        lineWidth: this.ctx?.lineWidth,
        colorStroke: this.ctx?.strokeStyle
      })
    }
  }

  mouseDownHandler(e: MouseEvent) {
    if (this.ctx) {
      const target = e.target as HTMLElement; 
      this.mouseDown = true

      this.currentX = e.pageX - target.offsetLeft
      this.currentY = e.pageY - target.offsetTop

      this.ctx.beginPath()
      this.ctx.moveTo(this.currentX, this.currentY)
      this.saved = this.canvas.toDataURL()
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const target = e.target as HTMLElement;
      this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
    }
  }

  draw(x: number, y: number) {
    const img = new Image()
    img.src = this.saved

    img.onload = () => {
      if (this.ctx !== null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }
    }
  }

  static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, currentX: number, currentY: number, lineWidth: number, colorStroke: string) {
    const strokeStyleOld = ctx.strokeStyle;
    const lineWidthOld = ctx.lineWidth

    ctx.strokeStyle = colorStroke;
    ctx.lineWidth = lineWidth
    ctx.moveTo(currentX, currentY)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.strokeStyle = strokeStyleOld;
    ctx.lineWidth = lineWidthOld
  }
}