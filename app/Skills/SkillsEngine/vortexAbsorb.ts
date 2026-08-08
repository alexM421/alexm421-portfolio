import Matter from 'matter-js'
import type { VortexCoordinates, VortexData } from '../useSkillsData'
import { setRightVortexShine } from '../vortexInteraction'

const SLOW_TIME_SCALE = 0.02
const ABSORB_DELAY_MS = 550
const WALL_LABELS = new Set(['ground', 'roof', 'leftWall', 'rightWall'])

type TriggerPoof = (cx: number, cy: number, count?: number) => void

/**
 * When a brick enters the right ("in") vortex:
 * - shine vortex stroke
 * - slow world timeScale
 * - after a short delay, poof + remove the brick
 */
export const setupVortexAbsorb = (
  engine: Matter.Engine,
  coordinates: VortexCoordinates,
  vortexRadius: VortexData['vortexRadius'],
  triggerPoof: TriggerPoof,
  onSkillAbsorbed?: (brickLabel: string) => void,
) => {
  const { vortexCenterY, vortexRCenterX } = coordinates
  const absorbingIds = new Set<number>()
  const pendingTimeouts: number[] = []

  const getDynamicBodies = () =>
    engine.world.bodies.filter((body) => !body.isStatic && !WALL_LABELS.has(body.label))

  const isInsideRightVortex = (body: Matter.Body) => {
    const dx = body.position.x - vortexRCenterX
    const dy = body.position.y - vortexCenterY
    return Math.hypot(dx, dy) <= vortexRadius
  }

  const syncTimeAndShine = (anyInside: boolean) => {
    const active = anyInside || absorbingIds.size > 0
    engine.timing.timeScale = active ? SLOW_TIME_SCALE : 1
    setRightVortexShine(active ? 1 : 0)
  }

  const absorbBody = (body: Matter.Body) => {
    if (absorbingIds.has(body.id)) return
    absorbingIds.add(body.id)
    syncTimeAndShine(true)

    const timeoutId = window.setTimeout(() => {
      const stillInWorld = engine.world.bodies.includes(body)
      if (stillInWorld) {
        triggerPoof(body.position.x, body.position.y)
        onSkillAbsorbed?.(body.label)
        Matter.Composite.remove(engine.world, body)
      }
      absorbingIds.delete(body.id)
      syncTimeAndShine(getDynamicBodies().some(isInsideRightVortex))
    }, ABSORB_DELAY_MS)

    pendingTimeouts.push(timeoutId)
  }

  const onBeforeUpdate = () => {
    let anyInside = false

    for (const body of getDynamicBodies()) {
      if (!isInsideRightVortex(body)) continue
      anyInside = true
      absorbBody(body)
    }

    syncTimeAndShine(anyInside)
  }

  Matter.Events.on(engine, 'beforeUpdate', onBeforeUpdate)

  return () => {
    Matter.Events.off(engine, 'beforeUpdate', onBeforeUpdate)
    for (const id of pendingTimeouts) window.clearTimeout(id)
    pendingTimeouts.length = 0
    absorbingIds.clear()
    engine.timing.timeScale = 1
    setRightVortexShine(0)
  }
}
