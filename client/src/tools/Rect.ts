import { ITool } from "../interfaces";
import { Socket } from "./Socket";
import { Tool } from "./Tool";

export class Rect extends Tool implements ITool {
  private mouseDown: boolean = false
  private width: number = 0;
  private height: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  private saved: string = '';

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false

    if (this.id) {
      Socket.sendDrawMessage(this.socket, this.id, 'rect', {
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
        lineWidth: this.ctx?.lineWidth,
        colorStroke: this.ctx?.strokeStyle,
        colorFill: this.ctx?.fillStyle
      })
    }
  }

  mouseDownHandler(e: MouseEvent) {
    if (this.ctx) {
      this.mouseDown = true
      this.ctx.beginPath()

      const target = e.target as HTMLElement; 
      this.startX = e.pageX - target.offsetLeft
      this.startY = e.pageY - target.offsetTop
      this.saved = this.canvas.toDataURL()
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const target = e.target as HTMLElement; 
      const currentX = e.pageX - target.offsetLeft;
      const currentY = e.pageY - target.offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;

      this.draw(this.startX, this.startY, this.width, this.height)
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image()
    img.src = this.saved

    img.onload = () => {
      if (this.ctx !== null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx.beginPath()
        this.ctx.rect(x, y, w, h)
        this.ctx.fill()
        this.ctx.stroke()
      }
    }
  }

  static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lineWidth: number, colorStroke: string, colorFill: string) {
    const strokeStyleOld = ctx.strokeStyle;
    const fillStyleOld = ctx.fillStyle
    const lineWidthOld = ctx.lineWidth

    ctx.strokeStyle = colorStroke;
    ctx.fillStyle = colorFill;
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = strokeStyleOld;
    ctx.fillStyle = fillStyleOld
    ctx.lineWidth = lineWidthOld
  }
}