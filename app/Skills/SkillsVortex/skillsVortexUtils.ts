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
    color: string
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

    for(const particlesArr of Object.values(particlesArrays)){

        for (let i = 1; i <= particlesCount; i++) {
            const particle = {
                radius: (i / particlesCount) * vortexRadius,
                angle: {
                    rad: 0,
                    vrad: (Math.random()+1)*vortexRadius/250+1,
                },
                color: '#FF4F0040',
            }
            particlesArr.push(particle)
        }

    }

    return particlesArrays
}

const drawVortex = (cx: number, cy: number, ctx: CanvasRenderingContext2D, particles: Particle[], vortexRadius: number, dt: number, variant: 'in'|'out') => {
    
    const newParticlesArray = []

    while(particles.length > 0){
        const particle = particles.shift()
        if(!particle) continue
    
        const { radius, angle: { rad, vrad }, color  } = particle
    
        const x = cx + Math.cos(rad) * radius
        const y = cy + Math.sin(rad) * radius
        
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        if(variant === "in"){
            particle.angle.rad += vrad * dt
            particle.radius -= (100*dt)
            
            if(particle.radius > 3) newParticlesArray.push(particle)
            else {
                const newParticle = {
                    radius: vortexRadius,
                    angle: {
                        rad: Math.random()*Math.PI*2,
                        vrad: (Math.random()+1)*(250/vortexRadius)+1,
                    },
                    color: '#FF4F0040',
                }
                newParticlesArray.push(newParticle)
            }
        
        }else{
            particle.angle.rad -= vrad * dt
            particle.radius += (100*dt)
            
            if(particle.radius < vortexRadius) newParticlesArray.push(particle)
            else {
                const newParticle = {
                    radius: 3,
                    angle: {
                        rad: Math.random()*Math.PI*2,
                        vrad: (Math.random()+1)*(250/vortexRadius)+1,
                    },
                    color: '#FF4F0040',
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
        ctx.fillStyle = 'rgba(27, 27, 27, 0.12)'
        ctx.fillRect(0, 0, width, height)
        //draw the vortexes
        drawVortex(vortexLCenterX, vortexCenterY, ctx, leftParticlesArr, vortexRadius, dt,"out")
        drawVortex(vortexRCenterX, vortexCenterY, ctx, rightParticlesArr, vortexRadius, dt,"in")

        animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
}

