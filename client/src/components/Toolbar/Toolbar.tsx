import React, { useState } from 'react'
import './Toolbar.scss';

import { canvasState, toolState } from '../../store';
import { Rect, Circle, Brush, Line, Eraser } from '../../tools';
import { ITool } from '../../interfaces';

const Toolbar: React.FC = () => {
  const [fillColor, setFillColor] = useState('')

  const setTool = <T extends ITool>(
    ToolClass: new (canvas: HTMLCanvasElement, socket: WebSocket, sessionId: string) => T, 
    canvas: HTMLCanvasElement | null, 
    socket: WebSocket | null, 
    sessionId: string | null
  ) => {
    if (canvas && socket && sessionId) {
      toolState.setTool(new ToolClass(canvas, socket, sessionId));
      toolState.setFillColor(fillColor)
    }
  };

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    toolState.setFillColor(target.value)
    setFillColor(target.value)
  }

  const download = () => {
    if (canvasState.canvas) {
      const dataUrl = canvasState.canvas.toDataURL()
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = Date.now() + ".jpg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return ( 
    <div className='toolbar'>
      <button className='toolbar__btn brush' onClick={() => setTool(Brush, canvasState.canvas, canvasState.socket, canvasState.sessionId)} />
      <button className='toolbar__btn rect' onClick={() => setTool(Rect, canvasState.canvas, canvasState.socket, canvasState.sessionId)} />
      <button className='toolbar__btn circle' onClick={() => setTool(Circle, canvasState.canvas, canvasState.socket, canvasState.sessionId)} />
      <button className='toolbar__btn eraser' onClick={() => setTool(Eraser, canvasState.canvas, canvasState.socket, canvasState.sessionId)} />
      <button className='toolbar__btn line' onClick={() => setTool(Line, canvasState.canvas, canvasState.socket, canvasState.sessionId)} />
      <button className='toolbar__btn clear' onClick={() => canvasState.clear()} />
      <input className='toolbar__input color' onChange={(e) => changeColor(e)} type="color" />
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()} />
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()} />
      <button className='toolbar__btn save' onClick={() => download()} />
    </div>
   );
}
 
export default Toolbar;