import { makeAutoObservable } from "mobx";

import { Socket } from "../tools/Socket";
import { Tool } from "../tools/Tool";

class CanvasState {
  public canvas: HTMLCanvasElement | null = null;
  public socket: WebSocket | null = null;
  public sessionId: string = '';
  public username: string = '';
  public undoList: string[] = [];
  public redoList: string[] = [];

  constructor() {
    makeAutoObservable(this)
  }

  setSocket(socket: WebSocket) {
    this.socket = socket
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId
  }

  setUsername(username: string) {
    this.username = username
  }
  
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }
  
  pushToUndo(data: string) {
    this.undoList.push(data)
  }
  
  pushToRedo(data: string) {
    this.redoList.push(data)
  }

  clear() {
    const canvas = this.canvas
    const ctx = canvas?.getContext('2d')
  
    if (canvas && ctx && this.socket && this.sessionId) {
      Tool.clearAll(ctx, canvas.width, canvas.height)
      Socket.sendDrawMessage(this.socket, this.sessionId, 'clear', {
        width: canvas.width,
        height: canvas.height
      })
    }
  }

  undo() {
    const canvas = this.canvas
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      if(this.undoList.length > 0) {
        const dataUrl = this.undoList.pop()

        if (dataUrl) {
          this.redoList.push(canvas.toDataURL())
          Tool.print(ctx, canvas.width, canvas.height, dataUrl)

          if (this.socket && this.sessionId) {
            Socket.sendDrawMessage(this.socket, this.sessionId, 'undo', {
              width: canvas.width,
              height: canvas.height,
              imgUrl: dataUrl,
            })
          }
        }
      } else {
        Tool.clearAll(ctx, canvas.width, canvas.height)
      }
    }
  }

  redo() {
    const canvas = this.canvas
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      if(this.redoList.length > 0) {
        const dataUrl = this.redoList.pop()
        if (dataUrl) {
          this.undoList.push(canvas.toDataURL())
          Tool.print(ctx, canvas.width, canvas.height, dataUrl)

          if (this.socket && this.sessionId) {
            Socket.sendDrawMessage(this.socket, this.sessionId, 'redo', {
              width: canvas.width,
              height: canvas.height,
              imgUrl: dataUrl,
            })
          }
        }
      }
    }
  }
}

export const canvasState = new CanvasState();