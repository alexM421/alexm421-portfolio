import { skillsData } from "../useSkillsData"

type ParticlesArrays = {
    leftParticlesArr: Particle[],
    rightParticlesArr: Particle[]
}

type Particle = {
    radius: number,
    angle: {
        rad: number,
        vrad: number
    },
    color: string,
    countId: number
}

export const setupCanvas = (ref: React.RefObject<HTMLCanvasElement | null>, container: HTMLDivElement) => {
    const canvas = ref.current
    if (!canvas) return null
    
    if(!container) return null
    const skillsHeigth = container.clientHeight
    const skillsWidth = container.clientWidth
    
    canvas.height = skillsHeigth
    canvas.width = skillsWidth
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    return { ctx }
}

const getParticlesArr = (vortexRadius: number, particlesCount: number) => {

    const particlesArrays: ParticlesArrays = {
        leftParticlesArr: [],
        rightParticlesArr : [],
    }

    let isRightParticlesArr = false

    for(const particlesArr of Object.values(particlesArrays)){

        for (let i = 1; i <= particlesCount; i++) {
            const particle = {
                radius:  isRightParticlesArr? vortexRadius:0,
                angle: {
                    rad: (i/particlesCount)*Math.PI*2,
                    vrad: Math.random()*10,
                },
                color: '#FF4F0040',
                countId: i,
            }
            particlesArr.push(particle)
        }

        isRightParticlesArr = true
    }

    return particlesArrays
}

const drawVortex = (cx: number, cy: number, ctx: CanvasRenderingContext2D, particles: Particle[], vortexRadius: number, dt: number, variant: 'in'|'out', particlesCount: number) => {
    
    const newParticlesArray = []

    while(particles.length > 0){
        const particle = particles.shift()
        if(!particle) continue
    
        const { radius, angle: { rad, vrad }, color  } = particle

        const x = cx + Math.cos(rad) * radius
        const y = cy + Math.sin(rad) * radius

        const t = radius/vortexRadius
        const alpha = variant==="in"? t:1-t  // or smooth(1 - t) for "out"
        
        ctx.globalAlpha = alpha * 0.25  // 0.25 = your base opacity (#FF4F0040 ≈ 25%)
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#FF4F00'       // solid orange; alpha from globalAlpha
        ctx.fill()
        ctx.globalAlpha = 1     

        if(variant === "in"){
            particle.angle.rad += vrad * dt
            particle.radius -= (100*dt)
            
            if(particle.radius > 0) newParticlesArray.push(particle)
            else {
                const newParticle = {
                    radius: vortexRadius,
                    angle: {
                        rad: (particle.countId/particlesCount)*Math.PI*2,
                        vrad: Math.random()*5,
                    },
                    color: '#FF4F0040',
                    countId: particle.countId
                }
                newParticlesArray.push(newParticle)
            }
        
        }else{
            particle.angle.rad -= vrad * dt
            particle.radius += (100*dt)
            
            if(particle.radius < vortexRadius) newParticlesArray.push(particle)
            else {
                const newParticle = {
                    radius: 0,
                    angle: {
                        rad: (particle.countId/particlesCount)*Math.PI*2,
                        vrad: Math.random()*5,
                    },
                    color: '#FF4F0040',
                    countId: particle.countId
                }
                newParticlesArray.push(newParticle)
            }
        }
        

    }

    particles.push(...newParticlesArray)
   
}

export const setupAnimation = (ctx: CanvasRenderingContext2D, skillsData: skillsData, particlesCount: number) => {

    const { skills: { width, height } } = skillsData
    const { vortexData: { coordinates, vortexRadius }} = skillsData
    const { vortexCenterY, vortexLCenterX, vortexRCenterX } = coordinates

    
    const { leftParticlesArr, rightParticlesArr } = getParticlesArr(vortexRadius, particlesCount)
  
    let lastFrameTime: undefined | number
    let animationId: number

    const animate = (time: number) => {
    

        //converting ms to s
        const dt = lastFrameTime===undefined? 0: (time - lastFrameTime)/1000
        lastFrameTime = time
    
        // fade trail
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'  // removes ~12% opacity per frame
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
        //draw the vortexes
        drawVortex(vortexLCenterX, vortexCenterY, ctx, leftParticlesArr, vortexRadius, dt,"out", particlesCount)
        drawVortex(vortexRCenterX, vortexCenterY, ctx, rightParticlesArr, vortexRadius, dt,"in", particlesCount)

        animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
}

