import React, { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useParams } from "react-router-dom"
import './Canvas.scss';

import { canvasState, toolState } from '../../store';
import { Tool, Rect, Circle, Brush, Line, Eraser } from '../../tools';

import Modal from '../Modal/Modal';

const API_BASE_URL = 'localhost:5000' 

const Canvas: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [isShowModal, setIsShowModal] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const usernameRef = useRef<HTMLInputElement | null>(null)

  const fetchImage = useCallback(async () => {
    if (canvasRef.current && id) {
      try {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        const response = await axios.get(`http://${API_BASE_URL}/image?id=${id}`);
        if (response.data.img) {
          Tool.print(ctx, canvasRef.current.width, canvasRef.current.height, response.data.img)
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }, [id]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasState.setCanvas(canvasRef.current);
      fetchImage()
    }

    return () => {
      canvasState.socket?.close();
    };
  }, [fetchImage]);

  const drawHandler = useCallback((msg: {
    figure: { 
      type: string, 
      x: number, 
      y: number, 
      currentX: number, 
      currentY: number, 
      width: number, 
      height: number, 
      radius: number, 
      lineWidth: number, 
      colorStroke: string, 
      colorFill: string, 
      imgUrl: string
    }
  }) => {
    if (canvasRef.current) {
      const figure = msg.figure
      const ctx = canvasRef.current.getContext('2d')

      if (ctx) {
        switch (figure.type) {
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y)
                break
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.lineWidth, figure.colorStroke)
                break
            case "line":
                Line.staticDraw(ctx, figure.x, figure.y, figure.currentX, figure.currentY, figure.lineWidth, figure.colorStroke)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.lineWidth, figure.colorStroke, figure.colorFill)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.lineWidth, figure.colorStroke, figure.colorFill)
                break
            case "clear":
                Tool.clearAll(ctx, figure.width, figure.height)
                break
            case "undo":
            case "redo":
                Tool.print(ctx, figure.width, figure.height, figure.imgUrl)
                break
            case "finish":
                Tool.finish(ctx)
                break
            default:
                console.warn(`Unknown figure type: ${figure.type}`);
        }
      }
    }
  }, [])

  const initializeWebSocket = useCallback((username: string) => {
    if (username && id && canvasRef.current) {
      const socket = new WebSocket(`ws://${API_BASE_URL}/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(id);
      canvasState.setUsername(username);

      toolState.setTool(new Brush(canvasRef.current, socket, id));

      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: id,
          method: "connection",
          username
        }));
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'connection' && username !== msg?.username) {
          alert(`User ${msg.username} has connected`)
        }

        if (msg.method === 'draw') {
          drawHandler(msg);
        }
      };
    }
  }, [drawHandler, id]);

  const handleMouseDown = () => {
    if (canvasRef.current) {
      canvasState.pushToUndo(canvasRef.current.toDataURL())
    }
  }

  const handleMouseUp = useCallback(() => {
    if (canvasRef.current) {
      axios.post(`http://${API_BASE_URL}/image?id=${id}`, { img: canvasRef.current.toDataURL() })
        .catch(error => console.error('An error occurred:', error));
    }
  }, [id]);

  const handleConnection = useCallback(() => {
    if (usernameRef.current && usernameRef.current.value.trim().length) {
      initializeWebSocket(usernameRef.current.value)
      fetchImage()
      setIsShowModal(false);
    }
  }, [fetchImage, initializeWebSocket]);

  return ( 
    <div className='canvas'>
    <Modal
      show={isShowModal}
      title='Enter your name'
    >
      <div className='modal-username'>
        <input className='modal-username__input' type='text' ref={usernameRef}/>
        <button className='modal-username__btn' onClick={handleConnection}>Login</button>
      </div>
    </Modal>
    <Modal
      show={isShowModal}
      title='Enter your name'
    >
      <div className='modal-username'>
        <input className='modal-username__input' type='text' ref={usernameRef}/>
        <button className='modal-username__btn' onClick={handleConnection}>Login</button>
      </div>
    </Modal>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        width={1067}
        height={600}
      />
    </div>
   );
})
 
export default Canvas;