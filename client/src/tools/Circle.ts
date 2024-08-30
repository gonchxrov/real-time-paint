import { ITool } from "../interfaces";
import { Socket } from "./Socket";
import { Tool } from "./Tool";

export class Circle extends Tool implements ITool {
  private mouseDown: boolean = false
  private startX: number = 0;
  private startY: number = 0;
  private radius: number = 0;
  private saved: string = '';

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false

    if (this.id) {
      Socket.sendDrawMessage(this.socket, this.id, 'circle', {
        x: this.startX,
        y: this.startY,
        radius: this.radius,
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
      const width = currentX - this.startX;
      const height = currentY - this.startY;
      this.radius = Math.sqrt(width**2 + height**2)

      this.draw(this.startX, this.startY, this.radius)
    }
  }

  draw(x: number, y: number, r: number) {
    const img = new Image()
    img.src = this.saved

    img.onload = () => {
      if (this.ctx !== null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.stroke()
      }
    }
  }
  
  static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, lineWidth: number, colorStroke: string, colorFill: string) {
    const strokeStyleOld = ctx.strokeStyle;
    const fillStyleOld = ctx.fillStyle
    const lineWidthOld = ctx.lineWidth

    ctx.strokeStyle = colorStroke;
    ctx.fillStyle = colorFill;
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = strokeStyleOld;
    ctx.fillStyle = fillStyleOld
    ctx.lineWidth = lineWidthOld
  }
}