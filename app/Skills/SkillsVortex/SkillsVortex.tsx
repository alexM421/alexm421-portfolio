"use client"
import { useEffect, useRef } from "react"
import type { skillsData } from "../useSkillsData"
import { setupAnimation, setupCanvas } from "./skillsVortexUtils"

const SkillsVortex = ({ skillsData }: { skillsData: skillsData }) => {
    
    const { skills, vortexData } = skillsData
    const { container } = skills
    const { vortexRadius } = vortexData

    const vortexCanvasRef = useRef<null | HTMLCanvasElement>(null)

    const PARTICLES_COUNT = 200

    useEffect(() => {

        const setup = setupCanvas(vortexCanvasRef, container)
        if(!setup) return
        const { ctx } = setup

        const stopAnimation = setupAnimation(ctx, skillsData, PARTICLES_COUNT)

        return () => {
            stopAnimation() 
        }
        
    }, [skillsData, container, vortexRadius])



    return (
        <canvas ref={vortexCanvasRef} className="absolute inset-0 pointer-events-none"/>
    )
}

export default SkillsVortex