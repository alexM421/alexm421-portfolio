import Matter from 'matter-js'

type PoofPixel = {
  x: number
  y: number
  draw: boolean
}

export type PoofEffect = {
  bornAt: number
  poofArr: PoofPixel[]
  color: string
  size: number
  vx: number
  vy: number
}

const POOF_REROLL_INTERVAL_MS = 150
const POOF_MAX_LIFE_MS = 1200

export const createPoofParticle = (cx: number, cy: number): PoofEffect => {
  const poofArr: PoofPixel[] = []
  const centerOffset = { x: (Math.random() * 2 - 1) * 80, y: (Math.random() * 2 - 1) * 40 }
  const sizeOffset = 4
  const size = Math.random() + 1

  for (let i = 0; i < 64; i++) {
    const xOffset = (i % 8 - sizeOffset) * size
    const yOffset = (Math.floor(i / 8) - sizeOffset) * size

    const centerDistance = Math.hypot(xOffset, yOffset)
    const p = 0.7 * (1 - centerDistance / (4 * size))

    poofArr.push({
      x: cx + xOffset + centerOffset.x,
      y: cy + yOffset + centerOffset.y,
      draw: Math.random() <= p,
    })
  }

  const shades = ['#D0D0D0', '#D8D8D8', '#E0E0E0', '#E8E8E8', '#F0F0F0', '#F5F5F5']
  const color = shades[Math.floor(Math.random() * shades.length)]

  return {
    bornAt: performance.now(),
    poofArr,
    color,
    size,
    vx: Math.random() * 40 - 20,
    vy: Math.random() * 40 - 20,
  }
}

export const drawPoof = (ctx: CanvasRenderingContext2D, poof: PoofEffect) => {
  ctx.fillStyle = poof.color

  for (const pixel of poof.poofArr) {
    if (!pixel.draw) continue
    ctx.fillRect(
      Math.round(pixel.x),
      Math.round(pixel.y),
      poof.size + 1,
      poof.size + 1,
    )
  }
}

const hasDrawablePixels = (poof: PoofEffect) => poof.poofArr.some((pixel) => pixel.draw)

const updatePoof = (poof: PoofEffect, dtMs: number, shouldRerollDraw: boolean) => {
  for (const pixel of poof.poofArr) {
    if (!pixel.draw) continue
    pixel.x += (poof.vx * dtMs) / 1000
    pixel.y += (poof.vy * dtMs) / 1000
    if (shouldRerollDraw) pixel.draw = Math.random() > 0.5
  }
}

const isPoofExpired = (poof: PoofEffect, now: number) =>
  now - poof.bornAt >= POOF_MAX_LIFE_MS || !hasDrawablePixels(poof)

/** One shared afterRender hook — auto Events.off when nothing left to draw. */
export const setupPoofEffects = (render: Matter.Render) => {
  const activePoofs: PoofEffect[] = []
  let lastTime: number | undefined
  let rerollTimer = performance.now()
  let isListening = false

  const draw = () => {
    if (activePoofs.length === 0) {
      Matter.Events.off(render, 'afterRender', draw)
      isListening = false
      return
    }

    const now = performance.now()
    const dtMs = lastTime === undefined ? 0 : now - lastTime
    const shouldRerollDraw = now - rerollTimer >= POOF_REROLL_INTERVAL_MS

    if (shouldRerollDraw) rerollTimer = now
    lastTime = now

    for (let i = activePoofs.length - 1; i >= 0; i--) {
      const poof = activePoofs[i]
      updatePoof(poof, dtMs, shouldRerollDraw)

      if (isPoofExpired(poof, now)) {
        activePoofs.splice(i, 1)
        continue
      }

      drawPoof(render.context, poof)
    }

    if (activePoofs.length === 0) {
      Matter.Events.off(render, 'afterRender', draw)
      isListening = false
    }
  }

  const ensureListening = () => {
    if (isListening) return
    lastTime = undefined
    rerollTimer = performance.now()
    Matter.Events.on(render, 'afterRender', draw)
    isListening = true
  }

  const triggerPoof = (cx: number, cy: number, count = 30) => {
    for (let i = 0; i < count; i++) {
      activePoofs.push(createPoofParticle(cx, cy))
    }
    ensureListening()
  }

  const cleanup = () => {
    Matter.Events.off(render, 'afterRender', draw)
    activePoofs.length = 0
    isListening = false
  }

  return { triggerPoof, cleanup }
}
