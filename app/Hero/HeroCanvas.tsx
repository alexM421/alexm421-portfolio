'use client'

import { useEffect, useRef } from 'react'
import { NAVBAR_HEIGHT } from '@/constants/layout'

type Ball = {
  currentPos: { x: number; y: number }
  speed: { vx: number; vy: number }
  radius: number
  color: string
}

const CONNECTION_DISTANCE = 150
const LINE_COLOR = '#FF4F00'
const LINE_OPACITY = 0.7

const updateBalls = (balls: Ball[], width: number, height: number) => {
  for (const ball of balls) {
    ball.currentPos.x += ball.speed.vx
    ball.currentPos.y += ball.speed.vy

    const isBallHittingLeftWall  = ball.currentPos.x - ball.radius < 0
    const isBallHittingRightWall = ball.currentPos.x + ball.radius > width
    if (isBallHittingLeftWall || isBallHittingRightWall) {
      ball.speed.vx *= -1
      if(isBallHittingLeftWall){
        ball.currentPos.x = ball.radius
      }if(isBallHittingRightWall){
        ball.currentPos.x = width - ball.radius
      }
    }
    
    const isBallHittingBottomWall = ball.currentPos.y + ball.radius > height
    const isBallHittingTopWall = ball.currentPos.y - ball.radius < 0 
    if (isBallHittingBottomWall || isBallHittingTopWall ) {
      ball.speed.vy *= -1
      if(isBallHittingBottomWall){
        ball.currentPos.y = height - ball.radius
      }if(isBallHittingTopWall){
        ball.currentPos.y = ball.radius
      }
    }
  }
}

const drawConnections = (
  ctx: CanvasRenderingContext2D,
  balls: Ball[],
  maxDistance: number,
) => {
  ctx.strokeStyle = LINE_COLOR
  ctx.lineWidth = 1

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[j].currentPos.x - balls[i].currentPos.x
      const dy = balls[j].currentPos.y - balls[i].currentPos.y
      const distance = Math.hypot(dx, dy)

      if (distance <= maxDistance) {
        // Fades out as distance increases (strongest when balls are closest)
        ctx.globalAlpha = LINE_OPACITY * (1 - distance / maxDistance)

        ctx.beginPath()
        ctx.moveTo(balls[i].currentPos.x, balls[i].currentPos.y)
        ctx.lineTo(balls[j].currentPos.x, balls[j].currentPos.y)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1
}

const drawBalls = (ctx: CanvasRenderingContext2D, balls: Ball[]) => {
  for (const ball of balls) {
    ctx.beginPath()
    ctx.arc(
      ball.currentPos.x,
      ball.currentPos.y,
      ball.radius,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = ball.color
    ctx.fill()
  }
}

const calculateCollisionSpeed = (ball1: Ball, ball2: Ball, normal: { nx: number, ny: number}) => {

  //projecting speeds onto the normals to determine the balls speed along the normal
  const ball1NormalSpeed = ball1.speed.vx * normal.nx + ball1.speed.vy * normal.ny
  const ball2NormalSpeed = (ball2.speed.vx * normal.nx + ball2.speed.vy * normal.ny)
  //relative speed alogns the normal
  const relativeSpeed = ball1NormalSpeed - ball2NormalSpeed
  //mass
  const m1 = ball1.radius ** 2
  const m2 = ball2.radius ** 2
  //elasticity
  const e = 1
  //impulse 
  const j = -(1 + e) * relativeSpeed / (1/m1 + 1/m2)
  //new speeds from the relative speed
  ball1.speed.vx += (j/m1) * normal.nx
  ball1.speed.vy += (j/m1) * normal.ny
  ball2.speed.vx -= (j/m2) * normal.nx
  ball2.speed.vy -= (j/m2) * normal.ny 
}

const collisionCheck = (balls: Ball[]) => {

  for(let i = 0; i< balls.length-1; i++){
    for(let j = i+1; j<balls.length;j++){
      const dx = balls[i].currentPos.x - balls[j].currentPos.x
      const dy = balls[i].currentPos.y - balls[j].currentPos.y
      const distance = Math.hypot(dx, dy)
      const normal = {
        nx: dx/distance,
        ny: dy/distance
      }

      if(distance <= balls[i].radius + balls[j].radius){
        calculateCollisionSpeed(balls[i],balls[j], normal)
      }
     
    }
  }
}

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = window.innerWidth
    const height = window.innerHeight - NAVBAR_HEIGHT.desktop
    canvas.width = width
    canvas.height = height

    const balls: Ball[] = Array.from({ length: 100 }, () => ({
      currentPos: { x: Math.random() * width, y: Math.random() * height },
      speed: { vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 },
      radius: 2 + Math.random() * 5,
      color: ['#E2E2E2', '#B4B5B5', '#FF4F00'][Math.floor(Math.random() * 3)],
    }))

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      updateBalls(balls, width, height)
      drawConnections(ctx, balls, CONNECTION_DISTANCE)
      drawBalls(ctx, balls)
      collisionCheck(balls)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      className="absolute left-0 -z-10 w-full"
      style={{
        height: `calc(100% - ${NAVBAR_HEIGHT.desktop}px)`,
        top: `${NAVBAR_HEIGHT.desktop}px`,
      }}
      ref={canvasRef}
    />
  )
}

export default HeroCanvas
