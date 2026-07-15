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
  const centerOffset = { x: Math.random()*50, y: Math.random()*20 }
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

  return {
    poofArr,
    color: '#EEEEEE',
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

const updatePoof = (poof: PoofEffect, dt: number, hasSecondElapsed: boolean) => {

    for(const pixel of poof.poofArr){
        if(!pixel.draw) continue
        pixel.x += poof.vx * dt/1000
        pixel.y += poof.vy * dt/1000
        if(hasSecondElapsed) pixel.draw = Math.random() > 0.5
    }
}

/** Temporary preview — draws one poof every frame at (cx, cy) so you can inspect the look. */
export const setupPoofPreview = (
  render: Matter.Render,
  cx: number,
  cy: number,
) => {
  const poofParticlesArray = [...Array(30)].map(() => createPoofParticle(cx, cy))
  let lastTime: number | undefined
  let poofTimer = performance.now()

  const draw = () => {
    const now = performance.now()
    const dt = lastTime === undefined? 0: (now - lastTime)
    const poofDt = (now-poofTimer)/1000 - 0.25
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
