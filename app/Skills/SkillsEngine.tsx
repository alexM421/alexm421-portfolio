"use client"

import { useEffect } from 'react'
import Matter from 'matter-js'


const labels = ['HTML','CSS','Javascript','React','Node','Next.js','Typescript','Git','Express','PostgreSQL','Docker','Canvas','TailwindCSS']

const SkillsEngine = ({ skillsRef }: { skillsRef: React.RefObject<HTMLDivElement | null> }) => {
  useEffect(() => {
    const container = skillsRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const engine = Matter.Engine.create()
    const render = Matter.Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio ?? 1,
      },
    })

    const { canvas } = render
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.background = 'transparent'
    canvas.style.pointerEvents = 'auto'
    canvas.style.zIndex = '0'

    const ground = Matter.Bodies.rectangle(width / 2, height, width, 10, { isStatic: true, label: 'ground' })

    const pendingBoxes = labels.map((label, i) => {

        const labelLength = label.length
        const boxWidth = 40 + labelLength * 8

        return(
          Matter.Bodies.rectangle(width / 2 + (i % 3) * 20, 80, boxWidth, 40, {
            label,
            render: {
              fillStyle: 'transparent',
              strokeStyle: '#FF4F00',
              lineWidth: 1,
            },
          })
        )
    }
    )

    //Spawn delayed boxes
    const SPAWN_DELAY_MS = 500

    const spawnNextBox = () => {
      const box = pendingBoxes.shift()
      if (box) Matter.Composite.add(engine.world, box)
      return pendingBoxes.length > 0
    }

    //Mouse
    const mouse = Matter.Mouse.create(render.canvas)
    mouse.pixelRatio = window.devicePixelRatio ?? 1

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })

    render.mouse = mouse
    Matter.Composite.add(engine.world, mouseConstraint)

    const skillBodies = () =>
      engine.world.bodies.filter((body) => body.label !== 'ground')

    const ACCENT = '#FF4F00'
    const ACCENT_SOFT = '#FFB59E'

    const resetHover = () => {
      for (const body of skillBodies()) {
        body.render.strokeStyle = ACCENT
      }
      canvas.style.cursor = 'default'
    }

    const updateHover = () => {
      const hovered = Matter.Query.point(skillBodies(), mouse.position)[0] ?? null

      for (const body of skillBodies()) {
        body.render.strokeStyle = body === hovered ? ACCENT_SOFT : ACCENT
      }

      canvas.style.cursor = hovered ? 'grab' : 'default'
    }

    Matter.Events.on(mouseConstraint, 'mousemove', updateHover)
    Matter.Events.on(mouseConstraint, 'startdrag', () => {
      canvas.style.cursor = 'grabbing'
    })
    Matter.Events.on(mouseConstraint, 'enddrag', updateHover)

    canvas.addEventListener('mouseleave', resetHover)

    Matter.Composite.add(engine.world, [ground])
    spawnNextBox()

    const spawnInterval = window.setInterval(() => {
      if (!spawnNextBox()) window.clearInterval(spawnInterval)
      }, SPAWN_DELAY_MS)

    // vortex — must draw in afterRender (beforeRender is cleared by Matter each frame)


    const drawFrame = () => {
      const ctx = render.context

      for (const body of engine.world.bodies) {
        if (body.label === 'ground') continue
        const { x, y } = body.position
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(body.angle)
        ctx.fillStyle = '#E2E2E2'
        ctx.font = '16px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(body.label, 0, 2)
        ctx.restore()
      }
    }

    Matter.Events.on(render, 'afterRender', drawFrame)

    Matter.Render.run(render)

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    return () => {
      window.clearInterval(spawnInterval)
      canvas.removeEventListener('mouseleave', resetHover)
      Matter.Events.off(mouseConstraint, 'mousemove', updateHover)
      Matter.Events.off(mouseConstraint, 'enddrag', updateHover)
      Matter.Events.off(render, 'afterRender', drawFrame)
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      canvas.remove()
    }
  }, [skillsRef])

  return null
}
export default SkillsEngine