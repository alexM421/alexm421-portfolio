"use client"
import { RefObject, useEffect, useRef } from "react"

type Particle = {
    radius: number,
    angle: {
        rad: number,
        vrad: number
    },
    color: string
}

const createParticles = (radius: number) => {

    const particles: Particle[] = []

    for (let i = 1; i <= 100; i++) {
        const particle = {
            radius: (i / 100) * radius,
            angle: {
                rad: 0,
                vrad: (Math.random()+1)*radius/250+1,
            },
            color: '#FF4F0040',
        }
        particles.push(particle)
    }

    return particles
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


const SkillsVortex = ({ skillsRef }: { skillsRef: RefObject<HTMLDivElement | null>}) => {
    
    //linking the canvas to the vortex
    const vortexCanvasRef = useRef<null | HTMLCanvasElement>(null)

    useEffect(() => {
        //Setting up the canvas
        const vortexCanvas = vortexCanvasRef.current 
        if(!vortexCanvas) return
        const ctx = vortexCanvas.getContext("2d")
        if(!ctx) return

        //using the parent div to have the canvas fit it
        const skillsDiv = skillsRef.current
        if(!skillsDiv) return
        const skillsHeigth = skillsDiv.clientHeight
        const skillsWidth = skillsDiv.clientWidth

        vortexCanvas.height = skillsHeigth
        vortexCanvas.width = skillsWidth
        
        //vortex constants
        const vortexRadius = 100
        const vortexLeftCx = skillsWidth/4
        const vortexCy = skillsHeigth/2
        const vortexRightCx = 3*skillsWidth/4
        const particlesLeftVortex = createParticles(vortexRadius)
        const particlesRightVortex = createParticles(vortexRadius)
        
        //animate function
        let lastFrameTime: undefined | number
        let animationId: number
        
        const animate = (time: number) => {
            //converting frame to ms
            const dt = lastFrameTime===undefined? 0: (time - lastFrameTime)/1000
            lastFrameTime = time
            
            // fade trail
            ctx.fillStyle = 'rgba(27, 27, 27, 0.12)'
            ctx.fillRect(0, 0, skillsWidth, skillsHeigth)
            //draw the vortexes
            drawVortex(vortexLeftCx, vortexCy, ctx, particlesLeftVortex, vortexRadius, dt,"out")
            drawVortex(vortexRightCx, vortexCy, ctx, particlesRightVortex, vortexRadius, dt,"in")
            
            animationId = requestAnimationFrame(animate)
        }
        
        animationId =  requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    })



    return (
        <canvas ref={vortexCanvasRef} className="absolute inset-0 "/>
    )
}

export default SkillsVortex