import React, { useEffect, useState } from 'react'

export type skillsData = {
    skills: {
        container: HTMLDivElement,
        width: number,
        height: number
    },
    vortexData: {
        coordinates: {
            vortexCenterY: number,
            vortexLCenterX: number,
            vortexRCenterX: number
        },
        vortexRadius: number
    }
}

export type VortexCoordinates = skillsData['vortexData']['coordinates']
export type VortexData = skillsData['vortexData']
export type SkillsLayout = skillsData['skills']

const VORTEX_RADIUS = 100

const buildSkillsData = (container: HTMLDivElement): skillsData => {
    const width = container.clientWidth
    const height = container.clientHeight

    return {
        skills: {
            container,
            width,
            height,
        },
        vortexData: {
            coordinates: {
                vortexCenterY: height / 2 + 60,
                vortexLCenterX: width / 4,
                // Keep portal fully inside the right gutter (lg:pr-80 = 320px)
                vortexRCenterX: width - (VORTEX_RADIUS + 80),
            },
            vortexRadius: VORTEX_RADIUS,
        },
    }
}

const useSkillsData = (skillsRef: React.RefObject<HTMLDivElement | null>) => {
  
    const [skillsData, setSkillsData] = useState<skillsData | null>()

    useEffect(() => {
        const container = skillsRef.current
        if (!container) return

        setSkillsData(buildSkillsData(container))

        let frameId = 0
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frameId)
            frameId = requestAnimationFrame(() => {
                setSkillsData((prev) => {
                    const next = buildSkillsData(container)
                    if (
                        prev &&
                        prev.skills.width === next.skills.width &&
                        prev.skills.height === next.skills.height
                    ) {
                        return prev
                    }
                    return next
                })
            })
        })

        observer.observe(container)

        return () => {
            cancelAnimationFrame(frameId)
            observer.disconnect()
        }
    }, [skillsRef])

    return skillsData
}

export default useSkillsData
