"use client"

import React, { useEffect, useRef } from 'react'

type Brick  = {
  name: string
  dimensions: {
    width: number,
    height: number
  },
  currentPos: {
    x: number,
    y: number,
  },
  speed: {
    vx: number,
    vy: number,
  },
  acceleration: {
    ax: number,
    ay: number,
  }
  angle: {
    rad: number,
    vrad: number,
    arad: number
  },
  color: string,
  fillColor: string
} 

const drawBrick = (ctx: CanvasRenderingContext2D, brick: Brick) => {
  
  const { x, y } = brick.currentPos
  const { width, height } = brick.dimensions 

  ctx.save()
  ctx.beginPath()
  ctx.translate(x,y)
  ctx.rotate(brick.angle.rad)
  ctx.rect(-width/2, -height/2, width, height)
  ctx.strokeStyle = brick.color
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = brick.color
  ctx.font = "20px JetBrains Mono"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  //+2 in the height accounts for font padding
  ctx.fillText(brick.name, 0, 2 )
  ctx.restore()
}

const updateBrick  = (ctx: CanvasRenderingContext2D, brick: Brick, canvasWidth: number, canvasHeight: number, dt: number) => {
  
  //update speed
  brick.speed.vx += brick.acceleration.ax * dt
  brick.speed.vy += brick.acceleration.ay * dt
  brick.angle.vrad += brick.angle.arad * dt;
  //update positions
  brick.currentPos.x += brick.speed.vx * dt * 1
  brick.currentPos.y += brick.speed.vy * dt * 1
  brick.angle.rad += brick.angle.vrad * dt

  //brick corners
  const { width, height } = brick.dimensions

  const originalCorners = {
    topLeft: { x: -width/2, y: -height/2 },
    topRight: { x: width/2, y: -height/2 },
    bottomRight: { x: width/2, y: height/2 },
    bottomLeft: { x:-width/2 , y: height/2 }
  }

  for(const corner of Object.values(originalCorners)){
    const { x , y } = corner
    const { rad } = brick.angle 

    const rotatedCorner = {
      rx: Math.cos(rad)*x - Math.sin(rad)*y,
      ry: Math.sin(rad)*x + Math.cos(rad)*y
    }

    const { rx, ry } = rotatedCorner

    const worldCorner = {
      wx: rx + brick.currentPos.x,
      wy: ry + brick.currentPos.y
    }

    const { wx, wy } = worldCorner


    //check for walls
    const hitLeftWall = wx <= 0
    const hitRightWall = wx >= canvasWidth
    const hitTopWall = wy <= 0
    const hitBottomWall = wy >= canvasHeight
    
    const restitution = 0.1

    
    if(hitTopWall || hitRightWall || hitLeftWall || hitBottomWall){
      //lever arm between corner and center of mass
      const r = {
        x: wx - brick.currentPos.x,
        y: wy - brick.currentPos.y
      }
      
      const contactVx =
        brick.speed.vx -
        brick.angle.vrad * r.y;
  
      const contactVy =
        brick.speed.vy +
        brick.angle.vrad * r.x;
      
        if(hitLeftWall || hitRightWall){
          brick.speed.vx *= -restitution
          brick.angle.vrad *= -0.3;
          brick.currentPos.x = hitLeftWall ? -rx  : canvasWidth - rx
        }
        if(hitTopWall || hitBottomWall){
          brick.speed.vy *= -restitution
          brick.angle.vrad *= -0.3;
          brick.currentPos.y = hitTopWall ? -ry  : canvasHeight - ry
        }
      
      }
  }
  
}


const testBrick: Brick = {
  name: "HTML",
  dimensions: {
    width: 80,
    height: 40
  },
  currentPos: {
    x: 180,
    y: 150
  },
  speed: {
    vx: -100,
    vy: 0
  },
  acceleration: {
    ax: 0,
    ay: 80
  },
  angle:{
    rad: 10,
    vrad: -10,
    arad: 0,
  },
  color: "#FF4F00",
  fillColor: "transparent"
}

const SkillsCanvas = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null>}) => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if(!containerRef.current) return
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    canvas.width = width
    canvas.height = height


    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      const dt = lastTime===0? 0:(time-lastTime)/1000
      lastTime = time

      ctx.clearRect(0,0,width,height)
      updateBrick(ctx, testBrick, width, height, dt)
      drawBrick(ctx, testBrick)
      animationId = requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)

  },[containerRef])

  return (
    <canvas 
      ref={canvasRef}
      className='absolute w-full h-full inset-0'/>  
  )
}

export default SkillsCanvas