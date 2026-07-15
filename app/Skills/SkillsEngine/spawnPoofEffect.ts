import Matter from 'matter-js'

type PoofPixel = {
  x: number
  y: number
  draw: boolean
}

export type PoofEffect = {
  poofArr: PoofPixel[]
  color: string
  size: number
  vx: number
  vy: number
}

export const createPoofParticle = (cx: number, cy: number): PoofEffect => {
  const poofArr: PoofPixel[] = []
  const centerOffset = { x: (Math.random()*2-1)*80, y: (Math.random()*2-1)*40 }
  const sizeOffset = 4
  const size = Math.random() + 1

  for (let i = 0; i < 64; i++) {
    const xOffset = (i % 8 - sizeOffset) * size
    const yOffset = (Math.floor(i / 8) - sizeOffset) * size

    const centerDistance = Math.hypot(xOffset, yOffset)
    const p = 0.7 * (1 - (centerDistance / (4 * size)))

    poofArr.push({
      x: cx + xOffset + centerOffset.x,
      y: cy + yOffset + centerOffset.y,
      draw: Math.random() <= p,
    })
  }

  const shades = [
    "#D0D0D0",
    "#D8D8D8",
    "#E0E0E0",
    "#E8E8E8",
    "#F0F0F0",
    "#F5F5F5"
  ];
  
  const color = shades[Math.floor(Math.random() * shades.length)];

  return {
    poofArr,
    color: color,
    size,
    vx: Math.random()*40-20,
    vy: Math.random()*40-20,
  }
}

export const drawPoof = (ctx: CanvasRenderingContext2D, poof: PoofEffect) => {
  ctx.fillStyle = poof.color

  for (const pixel of poof.poofArr) {
    if (!pixel.draw) continue
    const x = Math.round(pixel.x)
    const y = Math.round(pixel.y) 
    // +1 overlap removes hairline gaps between adjacent poof pixels
    ctx.fillRect(x, y, poof.size + 1, poof.size + 1)
  }
}

const updatePoof = (poof: PoofEffect, dt: number, hasTimeElasped: boolean) => {

    for(const pixel of poof.poofArr){
        if(!pixel.draw) continue
        pixel.x += poof.vx * dt/1000
        pixel.y += poof.vy * dt/1000
        if(hasTimeElasped) pixel.draw = Math.random() > 0.5
    }
}

/** Temporary preview — draws one poof every frame at (cx, cy) so you can inspect the look. */
export const setupPoofPreview = (
  render: Matter.Render,
  cx: number,
  cy: number,
) => {
  const poofParticlesArray = [...Array(30)].map(() => createPoofParticle(cx, cy))
  const POOF_NEXT_FRAME_DELAY = 0.15
  let lastTime: number | undefined
  let poofTimer = performance.now()

  const draw = () => {
    const now = performance.now()
    const dt = lastTime === undefined? 0: (now - lastTime)
    const poofDt = (now-poofTimer)/1000 - POOF_NEXT_FRAME_DELAY
    const hasPoofDtElapsed = poofDt > 0
    lastTime = now
    poofTimer = hasPoofDtElapsed? now:poofTimer
    
    for(const poof of poofParticlesArray){
        updatePoof(poof, dt, hasPoofDtElapsed)
        drawPoof(render.context, poof)
    }
    
  }

  Matter.Events.on(render, 'afterRender', draw)

  return () => Matter.Events.off(render, 'afterRender', draw)
}
