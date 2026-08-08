import Matter from "matter-js"
import { VortexData, VortexCoordinates } from "../useSkillsData"
import { setupPoofEffects } from "./spawnPoofEffect"
import { setupVortexAbsorb } from "./vortexAbsorb"




export const setupEngine = ( 
    container: HTMLDivElement,
    width: number,
    heigth: number 
) => {
    const engine = Matter.Engine.create()
    const render = Matter.Render.create({
        element: container,
        engine,
        options: {
            width: width,
            height: heigth,
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
    canvas.style.zIndex = '10'
    
    return { engine, render }
}


export const setupWalls = (
    width: number,
    height: number,
    engine: Matter.Engine
) => {

    
    const ground = Matter.Bodies.rectangle(
        width/2,
        height+5,
        width,
        10,
        { isStatic: true, label: 'ground' }
    )

    const roof = Matter.Bodies.rectangle(
        width/2,
        -10,
        width,
        10,
        { isStatic: true, label: 'roof' }
    )

    const leftWall = Matter.Bodies.rectangle(
        -10,
        height/2,
        10,
        height,
        { isStatic: true, label: 'leftWall' }
    )

    const rightWall = Matter.Bodies.rectangle(
        width+10,
        height/2,
        10,
        height,
        { isStatic: true, label: 'rightWall' }
    )
    
    
    Matter.Composite.add(engine.world, [ground, roof, leftWall, rightWall])
}



export const setupBoxesSpawn = (
    vortexCoordinates: VortexCoordinates,
    vortexRadius: VortexData['vortexRadius'],
    engine: Matter.Engine,
    render: Matter.Render,
    onSkillAbsorbed?: (brickLabel: string) => void,
) => {

    const BOXES_LABELS = ['HTML','CSS','Javascript','React','Node','Next.js','Typescript','Git','Express','PostgreSQL','Docker','Canvas','TailwindCSS']
    const SPAWN_DELAY_MS = 800
    
    //get the pending boxes
    const { vortexCenterY, vortexLCenterX } = vortexCoordinates
    
    
    const pendingBoxes = BOXES_LABELS.map((label) => {
        
        const boxSpawnCenterX = vortexLCenterX + (Math.random()*2-1)*vortexRadius 
        const boxSpawnCenterY = vortexCenterY + (Math.random()*2-1)*vortexRadius
        
        //Adjusts box width depending on the length of the label inside
        const labelLength = label.length
        
        const boxWidth = 40 + labelLength * 8
        const boxHeigth = 40

        return(
            Matter.Bodies.rectangle(
            boxSpawnCenterX, 
            boxSpawnCenterY, 
            boxWidth, 
            boxHeigth, 
            {
                label,
                render: {
                fillStyle: 'transparent',
                strokeStyle: '#FF4F00',
                lineWidth: 1,
                },
            }
        ))
    })

    const { triggerPoof, cleanup: cleanupPoofEffects } = setupPoofEffects(render)
    const cleanupVortexAbsorb = setupVortexAbsorb(
        engine,
        vortexCoordinates,
        vortexRadius,
        triggerPoof,
        onSkillAbsorbed,
    )

    //spawning boxes
    const spawnNextBox = () => {
        const box = pendingBoxes.shift()
        if (box) {
            Matter.Composite.add(engine.world, box)
            triggerPoof(box.position.x, box.position.y)
        }
            return pendingBoxes.length > 0
    }

    const canvasWidth = render.options.width ?? 0
    const canvasHeight = render.options.height ?? 0
    const EDGE_PADDING = 24

    const fixOutsideBoxes = () => {
        for (const body of engine.world.bodies) {
            if (body.isStatic) continue

            const { min, max } = body.bounds
            const halfW = (max.x - min.x) / 2
            const halfH = (max.y - min.y) / 2
            let { x, y } = body.position
            let moved = false

            // Fully off-screen → snap back just inside the visible edge
            if (max.x < 0) {
                x = EDGE_PADDING + halfW
                moved = true
            } else if (min.x > canvasWidth) {
                x = canvasWidth - EDGE_PADDING - halfW
                moved = true
            }

            if (max.y < 0) {
                y = EDGE_PADDING + halfH
                moved = true
            } else if (min.y > canvasHeight) {
                y = canvasHeight - EDGE_PADDING - halfH
                moved = true
            }

            if (!moved) continue

            Matter.Body.setPosition(body, { x, y })
            Matter.Body.setVelocity(body, { x: 0, y: 0 })
            Matter.Body.setAngularVelocity(body, 0)
        }
    }

    Matter.Events.on(engine, 'beforeUpdate', fixOutsideBoxes)
  
    const spawnInterval = window.setInterval(() => {
        if (!spawnNextBox()) window.clearInterval(spawnInterval)
        }, SPAWN_DELAY_MS)

    return () => {
        window.clearInterval(spawnInterval)
        Matter.Events.off(engine, 'beforeUpdate', fixOutsideBoxes)
        cleanupVortexAbsorb()
        cleanupPoofEffects()
    }
}

export const setupMouse = (
    render: Matter.Render, 
    engine: Matter.Engine
) => {
    
    const ACCENT = '#FF4F00'
    const ACCENT_SOFT = '#FFB59E'
    
    //rendering the mouse 
    const mouse = Matter.Mouse.create(render.canvas)
    mouse.pixelRatio = window.devicePixelRatio ?? 1
    render.mouse = mouse
    // Matter.Mouse calls preventDefault on wheel, which blocks page scroll
    mouse.element.removeEventListener('wheel', mouse.mousewheel)
    
    //adding constraint
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })

    Matter.Composite.add(engine.world, mouseConstraint)

    //hover effect on boxes
    const getBoxesBodies = () =>   engine.world.bodies.filter((body) => !body.isStatic)

    const resetHover = () => {
      for (const body of getBoxesBodies()) {
        body.render.strokeStyle = ACCENT
      }
      render.canvas.style.cursor = 'default'
    }

    const updateHover = () => {
      const hovered = Matter.Query.point(getBoxesBodies(), mouse.position)[0] ?? null

      for (const body of getBoxesBodies()) {
        body.render.strokeStyle = body === hovered ? ACCENT_SOFT : ACCENT
      }

      render.canvas.style.cursor = hovered ? 'grab' : 'default'
    }

    const changeDragCursor = () =>  render.canvas.style.cursor = 'grabbing'

    Matter.Events.on(mouseConstraint, 'mousemove', updateHover)
    Matter.Events.on(mouseConstraint, 'startdrag', () => changeDragCursor)
    Matter.Events.on(mouseConstraint, 'enddrag', updateHover)

    render.canvas.addEventListener('mouseleave', resetHover)

    return () => {
        Matter.Events.off(mouseConstraint, 'mousemove', updateHover)
        Matter.Events.off(mouseConstraint, 'enddrag', updateHover)
        Matter.Events.off(mouseConstraint, 'startdrag', changeDragCursor)
        render.canvas.removeEventListener('mouseleave', resetHover)
    }
}

export const setupTextLabels = (
    render: Matter.Render,
    engine: Matter.Engine
) => {

    const drawLabel = () => {
        const ctx = render.context
    
        for (const body of engine.world.bodies) {
          if (['ground','roof','leftWall','rightWall'].includes(body.label)) continue
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

    Matter.Events.on(render, 'afterRender', drawLabel)
  
    return () => Matter.Events.off(render, 'afterRender', drawLabel)
}


  export const startSimulation = (render: Matter.Render, engine: Matter.Engine) => {
    Matter.Render.run(render)
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    return () => {
        Matter.Render.stop(render)
        Matter.Runner.stop(runner)
    }
  }