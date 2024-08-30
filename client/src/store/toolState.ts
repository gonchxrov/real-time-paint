import { makeAutoObservable } from "mobx";

import { ITool } from "../interfaces";

class ToolState {
  public tool: ITool | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setTool(tool: ITool) {
    this.tool = tool
  }
  
  setStrokeColor(color: string) {
    if (this.tool) {
      this.tool.strokeColor = color      
    }
  }
  
  setFillColor(color: string) {
    if (this.tool) {
      this.tool.fillColor = color
    }
  }
  
  setLineWidth(width: number) {
    if (this.tool) {
      this.tool.lineWidth = width
    }
  }
}

export const toolState = new ToolState();