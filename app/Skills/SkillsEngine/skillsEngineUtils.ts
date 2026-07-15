import Matter from "matter-js"
import { VortexData, VortexCoordinates } from "../useSkillsData"
import { setupPoofPreview } from "./spawnPoofEffect"




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
    canvas.style.zIndex = '0'
    
    return { engine, render }
}


export const setupWalls = (
    width: number,
    height: number,
    engine: Matter.Engine
) => {
    const rectangleCenterX = width/2
    const rectangleCenterY = height
    const rectangleWidth = width
    const rectangleHeigth = 10
    
    const ground = Matter.Bodies.rectangle(
        rectangleCenterX,
        rectangleCenterY,
        rectangleWidth,
        rectangleHeigth,
        { isStatic: true, label: 'ground' }
    )
    
    Matter.Composite.add(engine.world, [ground])
}



export const setupBoxesSpawn = (
    vortexCoordinates: VortexCoordinates,
    vortexRadius: VortexData['vortexRadius'],
    engine: Matter.Engine,
    render: Matter.Render
) => {

    const BOXES_LABELS = ['HTML','CSS','Javascript','React','Node','Next.js','Typescript','Git','Express','PostgreSQL','Docker','Canvas','TailwindCSS']
    const SPAWN_DELAY_MS = 500
    
    //get the pending boxes
    const { vortexCenterY, vortexLCenterX } = vortexCoordinates
    
    
    const pendingBoxes = BOXES_LABELS.slice(0,1).map((label) => {
        
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

    //spawning boxes
    const spawnNextBox = () => {
        const box = pendingBoxes.shift()
        if (box) {
            Matter.Composite.add(engine.world, box)
            setupPoofPreview(render, box.position.x, box.position.y)
        }
            return pendingBoxes.length > 0
    }
    
    const spawnInterval = window.setInterval(() => {
        if (!spawnNextBox()) window.clearInterval(spawnInterval)
        }, SPAWN_DELAY_MS)

    return () => window.clearInterval(spawnInterval)
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